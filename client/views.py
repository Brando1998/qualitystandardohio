import stripe
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from .models import ServiceOrder
from .serializers import ServiceOrderSerializer

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

# Configurar Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


class ServiceOrderCreateView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data

        # Calcular el precio base
        base_price = self.calculate_base_price(
            data.get("type_of_construction"),
            int(data.get("bedrooms_number")),
            int(data.get("bathrooms_number"))
        )
        extra_service_price = 25 * len(data.get("extra_services", []))  # Servicios extra
        total_price = base_price + extra_service_price

        # Determinar la frecuencia
        frequency = data.get("frequency", {}).get("frequency", None)
        is_subscription = frequency in ["every_two_weeks", "weekly", "monthly"]

        # Guardar el precio total calculado
        data["price"] = total_price

        serializer = ServiceOrderSerializer(data=data)
        if serializer.is_valid():
            # Guardar la orden de servicio
            service_order = serializer.save()

            try:
                if is_subscription:
                    # Verificar si el cliente ya existe en Stripe
                    customer_email = service_order.email
                    existing_customers = stripe.Customer.list(email=customer_email).data
                    if existing_customers:
                        customer = existing_customers[0]
                    else:
                        customer = stripe.Customer.create(
                            email=service_order.email,
                            name=service_order.name,
                        )

                    # Crear suscripción basada en frecuencia
                    stripe_price_id = self.get_stripe_price_id(frequency, total_price)
                    subscription = stripe.Subscription.create(
                        customer=customer.id,
                        items=[
                            {"price": stripe_price_id}
                        ],
                        expand=["latest_invoice.payment_intent"],
                    )
                    return Response(
                        {
                            "subscription_id": subscription.id,
                            "status": subscription.status,
                            "customer_email": service_order.email,
                        },
                        status=status.HTTP_201_CREATED,
                    )

                else:
                    # Crear una sesión de pago para pago único
                    session = stripe.checkout.Session.create(
                        payment_method_types=["card"],
                        line_items=[
                            {
                                "price_data": {
                                    "currency": "usd",
                                    "product_data": {
                                        "name": f"Servicio de Aseo: {service_order.type_of_construction}",
                                    },
                                    "unit_amount": int(service_order.price * 100),
                                },
                                "quantity": 1,
                            }
                        ],
                        mode="payment",
                        success_url="http://localhost:4200/success?session_id={CHECKOUT_SESSION_ID}",
                        cancel_url="http://localhost:4200/canceled",
                        metadata={
                            "order_id": service_order.id,
                        },
                    )
                    return Response({"url": session.url}, status=status.HTTP_201_CREATED)

            except stripe.error.StripeError as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                return Response({"error": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        service_orders = ServiceOrder.objects.all()
        serializer = ServiceOrderSerializer(service_orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def calculate_base_price(self, type_of_construction, bedrooms_number, bathrooms_number):
        """
        Calcula el precio base según el tipo de construcción, número de habitaciones y baños.
        """
        if type_of_construction == "apartment" and 0 <= bedrooms_number <= 2 and bathrooms_number in [0, 1]:
            return 130
        elif type_of_construction == "familiar" and 2 <= bedrooms_number <= 3 and 1 <= bathrooms_number <= 2:
            return 150
        elif type_of_construction == "familiar" and bedrooms_number > 3 and bathrooms_number > 2:
            return 170
        return 0  # Precio base predeterminado si no se cumplen las condiciones

    def get_stripe_price_id(self, frequency, total_price):
        """
        Retorna el `price_id` de Stripe basado en la frecuencia y precio.
        Puedes configurar estos precios manualmente en Stripe o crearlos automáticamente.
        """
        price_map = {
            "weekly": "price_1Abc123Weekly",        # Reemplazar con IDs reales de Stripe
            "every_two_weeks": "price_1Abc123Biweekly",
            "monthly": "price_1Abc123Monthly",
        }
        return price_map.get(frequency, None)


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.headers.get("Stripe-Signature", "")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError:
        return JsonResponse({"error": "Invalid payload"}, status=400)
    except stripe.error.SignatureVerificationError:
        return JsonResponse({"error": "Invalid signature"}, status=400)

    # Manejar eventos específicos
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        service_order_id = session.get("metadata", {}).get("order_id")
        if service_order_id:
            ServiceOrder.objects.filter(id=service_order_id).update(status=ServiceOrder.PAID)
        else:
            return JsonResponse({"error": "Order ID not found in session metadata"}, status=400)

    return JsonResponse({"status": "success"}, status=200)
