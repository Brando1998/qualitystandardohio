# urls.py

from django.urls import path
from .views import ServiceOrderCreateView, stripe_webhook

urlpatterns = [
    path('service-orders/', ServiceOrderCreateView.as_view(), name='service-order-list-create'),
    path('webhook/', stripe_webhook, name='webhook'),
]
