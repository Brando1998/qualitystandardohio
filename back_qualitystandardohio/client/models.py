# models.py

from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from ._services.kommo_api import KommoAPI
from django.conf import settings
import json

class ServiceOrder(models.Model):
    PENDING = 'pending_payment'
    PAID = 'paid'
    STATUS_CHOICES = [
        (PENDING, 'Pendiente de pago'),
        (PAID, 'Pagado')
    ]
    
    frequency_date = models.DateTimeField(null=True, blank=True)
    frequency_time = models.CharField(max_length=10, blank=True, null=True)
    frequency_week = models.CharField(max_length=50, blank=True, null=True)
    frequency_type = models.CharField(max_length=20, blank=True, null=True)
    extra_services = models.JSONField(default=list)  # JSONField para almacenar una lista de servicios extra
    type_of_construction = models.CharField(max_length=50)
    bedrooms_number = models.PositiveIntegerField()
    bathrooms_number = models.PositiveIntegerField()
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=200)
    accept_terms = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Campo de precio, opcional
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING)  # Estado con valores predeterminados

    def __str__(self):
        return f"Orden de servicio para {self.name} - Estado: {self.get_status_display()}"


@receiver(post_save, sender=ServiceOrder)
def sync_service_order_with_kommo(sender, instance, created, **kwargs):
    kommo = KommoAPI(
        access_token=settings.KOMMO_TOKEN,
        subdomain=settings.KOMMO_SUBDOMAIN
    )

    contact_data = {
        "name": instance.name,
        "first_name": instance.name.split()[0],
        "last_name": " ".join(instance.name.split()[1:]) if len(instance.name.split()) > 1 else "Doe",
        "custom_fields_values": [
            {
                "field_code": "PHONE",
                "values": [{"value": instance.phone}]
            },
            {
                "field_code": "EMAIL",
                "values": [{"value": instance.email}]
            }
        ]
    }

    try:
        # Buscar contacto por email
        contact = kommo.get_contact(instance.email)

        # Si existe al menos un contacto
        if contact.get("_embedded", {}).get("contacts", []):
            existing_contact = contact["_embedded"]["contacts"][0]
            contact_id = existing_contact["id"]

            print(f"Contacto existente encontrado: {contact_id}")
            
            # Actualizar el contacto
            update_data = {
                "name": contact_data["name"],
                "first_name": contact_data["first_name"],
                "last_name": contact_data["last_name"],
                "custom_fields_values": contact_data["custom_fields_values"]
            }
            kommo.update_contact(contact_id, update_data)
            print(f"Contacto actualizado: {contact_id}")
        else:
            # Crear nuevo contacto si no existe
            kommo.create_contact(contact_data)
            print(f"Nuevo contacto creado para: {instance.name}")
    except Exception as e:
        print(f"Error sincronizando con Kommo: {e}")




# "custom_fields_values": [
#     {
#         "field_code": "PHONE",
#         "values": [{"value": instance.phone}]
#     },
#     {
#         "field_code": "EMAIL",
#         "values": [{"value": instance.email}]
#     },
#     {
#         "field_code": "ADDRESS",
#         "values": [{"value": instance.address}]
#     },
#     {
#         "field_name": "Bedrooms",
#         "values": [{"value": instance.bedrooms_number}]
#     },
#     {
#         "field_name": "Bathrooms",
#         "values": [{"value": instance.bathrooms_number}]
#     },
#     {
#         "field_name": "Type of Construction",
#         "values": [{"value": instance.type_of_construction}]
#     }
# ]