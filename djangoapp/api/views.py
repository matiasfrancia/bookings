from django.shortcuts import render
from rest_framework import generics, status
from django.utils.dateparse import parse_date

from .models import Booking, DisabledBlocks, DisabledDays
from .serializers import (
    BookingSerializer, 
    CreateBookingSerializer, 
    CreateDisabledBlocksSerializer,
    CreateDisabledDaysSerializer, 
    DisabledBlocksSerializer, 
    CreateDisabledDaysSerializer, 
    DisabledDays, 
    DisabledDaysSerializer
)

from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
class ListBookingView(generics.ListAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer


class ListDisabledBlockView(generics.ListAPIView):
    serializer_class = DisabledBlocksSerializer

    def get_queryset(self):
        print(self.kwargs['day'])
        queryset = DisabledBlocks.objects.filter(day=self.kwargs['day'])
        return queryset


class ListDisabledDayView(generics.ListAPIView):
    queryset = DisabledDays.objects.all()
    serializer_class = DisabledDaysSerializer


class CreateBookingView(APIView):
    serializer_class = CreateBookingSerializer

    def post(self, request, format=None):

        print(request.data)
        
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            booking_date = serializer.data.get('booking_date')
            block = serializer.data.get('block')
            visitants = serializer.data.get('visitants')
            price = serializer.data.get('price')
            name = serializer.data.get('name')
            email = serializer.data.get('email')

            print("Booking date: " + booking_date)

            queryset = Booking.objects.filter(booking_date=booking_date, block=block)
            
            if queryset.exists():
                return Response(data="Ya existe una reserva en ese día y bloque", status=status.HTTP_226_IM_USED)
            else:
                disabled_blocks = DisabledBlocks.objects.create(day=booking_date, block=block)
                print(disabled_blocks)
                booking = Booking(booking_date=booking_date, block=block, visitants=visitants, price=price, name=name, email=email)
                booking.save()
                
                return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)

        return Response(data="There was an error in the creation of the booking", status=status.HTTP_400_BAD_REQUEST)


class CreateDisabledDaysView(APIView):
    serializer_class = CreateDisabledDaysSerializer

    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            day = serializer.data.get('day')
            queryset = DisabledDays.objects.filter(day=day)
            
            if queryset.exists():
                return Response(data="Ya existe una reserva en ese día y bloque", status=status.HTTP_226_IM_USED)
            else:
                disabled_day = DisabledDays(day=day)
                disabled_day.save()
                
                return Response(DisabledDaysSerializer(disabled_day).data, status=status.HTTP_201_CREATED)

        return Response(data="There was an error in the creation of the disabled day", status=status.HTTP_400_BAD_REQUEST)


class CreateDisabledBlocksView(APIView):
    serializer_class = CreateDisabledBlocksSerializer

    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            day = serializer.data.get('day')
            block = serializer.data.get('block')

            queryset = DisabledBlocks.objects.filter(day=day, block=block)
            
            if queryset.exists():
                return Response(data="Ya existe una reserva en ese día y bloque", status=status.HTTP_226_IM_USED)
            else:
                disabled_blocks = DisabledBlocks(day=day, block=block)
                disabled_blocks.save()
                
                return Response(DisabledBlocksSerializer(disabled_blocks).data, status=status.HTTP_201_CREATED)

        return Response(data="There was an error in the creation of the disabled blocks", status=status.HTTP_400_BAD_REQUEST)