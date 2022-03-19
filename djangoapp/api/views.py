from email.policy import HTTP
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import generics, status

from .models import Booking, Buyer
from .serializers import BookingSerializer, BuyerSerializer, CreateBookingSerializer, CreateBuyerSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
class ListBookingView(generics.ListAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer


class CreateBookingView(APIView):
    serializer_class = CreateBookingSerializer

    def post(self, request, format=None):
        
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            booking_date = serializer.data.get('booking_date')
            block = serializer.data.get('block')
            visitants = serializer.data.get('visitants')
            price = serializer.data.get('price')
            buyer = Buyer.objects.get(id=serializer.data.get('buyer'))

            queryset = Booking.objects.filter(booking_date=booking_date, block=block)
            
            if queryset.exists():
                return Response(data="Ya existe una reserva en ese día y bloque", status=status.HTTP_226_IM_USED)
            else:
                booking = Booking(booking_date=booking_date, block=block, visitants=visitants, price=price, buyer=buyer)
                booking.save()
                
                return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)

        return HttpResponse("<h2>There was an error in the creation of the booking<h2>")


class ListBuyerView(generics.ListAPIView):
    queryset = Buyer.objects.all()
    serializer_class = BuyerSerializer


class CreateBuyerView(APIView):
    serializer_class = CreateBuyerSerializer

    def post(self, request, format=None):
        
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            name = serializer.data.get('name')
            rut = serializer.data.get('rut')
            email = serializer.data.get('email')

            queryset = Buyer.objects.filter(rut=rut)
            
            if queryset.exists():
                return Response(status=status.HTTP_226_IM_USED)
            else:
                buyer = Buyer(name=name, rut=rut, email=email)
                buyer.save()
                
                return Response(BuyerSerializer(buyer).data, status=status.HTTP_201_CREATED)

