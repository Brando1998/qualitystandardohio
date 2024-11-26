from rest_framework import serializers
from .models import ServiceOrder

class ServiceOrderSerializer(serializers.ModelSerializer):
    frequency = serializers.DictField(write_only=True)

    class Meta:
        model = ServiceOrder
        fields = [
            'frequency',  # Campo de entrada anidada
            'frequency_date', 'frequency_time', 'frequency_week', 'frequency_type',
            'extra_services', 'type_of_construction', 'bedrooms_number', 
            'bathrooms_number', 'name', 'email', 'phone', 'address', 
            'accept_terms', 'notes', 'price', 'status'
        ]
        read_only_fields = ['frequency_date', 'frequency_time', 'frequency_week', 'frequency_type']

    def validate_frequency(self, value):
        """Validar que la frecuencia contiene las claves necesarias."""
        required_keys = ['date', 'time', 'week', 'frequency']
        for key in required_keys:
            if key not in value:
                raise serializers.ValidationError(f"La clave '{key}' es obligatoria en frequency.")
        return value

    def create(self, validated_data):
        """Sobrescribir create para asignar datos de frequency."""
        frequency_data = validated_data.pop('frequency', {})
        validated_data['frequency_date'] = frequency_data.get('date')
        validated_data['frequency_time'] = frequency_data.get('time')
        validated_data['frequency_week'] = frequency_data.get('week')
        validated_data['frequency_type'] = frequency_data.get('frequency')
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Sobrescribir update para asignar datos de frequency."""
        frequency_data = validated_data.pop('frequency', {})
        instance.frequency_date = frequency_data.get('date', instance.frequency_date)
        instance.frequency_time = frequency_data.get('time', instance.frequency_time)
        instance.frequency_week = frequency_data.get('week', instance.frequency_week)
        instance.frequency_type = frequency_data.get('frequency', instance.frequency_type)
        return super().update(instance, validated_data)
