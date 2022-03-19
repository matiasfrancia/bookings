from rest_framework import serializers

from .models import Booking, Buyer

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

    # TODO: add the foreign key field 

class CreateBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ('booking_date', 'block', 'visitants', 'price', 'buyer')

class BuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Buyer
        fields = '__all__'

class CreateBuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Buyer
        fields = ('name', 'rut', 'email')