from rest_framework import serializers

from .models import Booking, DisabledBlocks, DisabledDays, Payment

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class DisabledBlocksSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisabledBlocks
        fields = '__all__'

class DisabledDaysSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisabledDays
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'