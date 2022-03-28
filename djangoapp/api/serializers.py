from rest_framework import serializers

from .models import Booking, DisabledBlocks, DisabledDays

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class CreateBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ('booking_date', 'name', 'email', 'block', 'visitants', 'price')

class DisabledBlocksSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisabledBlocks
        fields = '__all__'

class CreateDisabledBlocksSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisabledBlocks
        fields = '__all__'

class DisabledDaysSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisabledDays
        fields = '__all__'

class CreateDisabledDaysSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisabledDays
        fields = '__all__'