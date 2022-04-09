import json
from django.shortcuts import get_object_or_404, render
from rest_framework import generics, status
from django.utils.dateparse import parse_date
from rest_framework.decorators import api_view
import requests

from .models import Booking, DisabledBlocks, DisabledDays, Payment
from .validations import validate_create_booking_block, validate_create_booking_visitants, validate_create_disabled_block, validate_create_disabled_day, validate_create_payment
from .serializers import (
    BookingSerializer, 
    DisabledBlocksSerializer,
    DisabledDaysSerializer,
    PaymentSerializer
)

from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
class ListBookingView(generics.ListAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer



@api_view(['GET'])
def ApiOverview(request):
    api_urls = {
        'all_items': '/',
        'Search by Category': '/?category=category_name',
        'Search by Subcategory': '/?subcategory=category_name',
        'Add': '/create',
        'Update': '/update/pk',
        'Delete': '/item/pk/delete'
    }
  
    return Response(api_urls)

# ============================================ Payment ============================================


@api_view(['POST'])
def create_payment(request):

    print(request.data)

    payment = PaymentSerializer(data=request.data)

    validations = [
        validate_create_payment(int(request.data.get('total'))),
    ]
    
    error_msg = "\n".join([msg for valid, msg in validations if not valid])
    print(error_msg)

    if error_msg != "":
        return Response(data=error_msg, status=status.HTTP_400_BAD_REQUEST)

    if payment.is_valid():
        total = payment.data.get('total')

        payment = Payment.objects.create(total=total)
        print(PaymentSerializer(payment).data)
            
        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)

    return Response(data="There was an error in the creation of the payment object", status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def view_payments(request):

    if request.query_params:
        payment = Payment.objects.filter(**request.query_params.dict())
    else:
        payment = Payment.objects.all()

    print(payment)
  
    if payment:
        data = PaymentSerializer(payment, many=True)
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def update_payment(request, pk):
    payment = Payment.objects.get(pk=pk)
    data = PaymentSerializer(instance=payment, data=request.data)
  
    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
def delete_payment(request, pk):
    payment = get_object_or_404(Payment, pk=pk)
    payment.delete()
    return Response(status=status.HTTP_202_ACCEPTED)

    
# ============================================ Blocks ============================================


""" class CreateDisabledBlocksView(APIView):
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

        return Response(data="There was an error in the creation of the disabled blocks", status=status.HTTP_400_BAD_REQUEST) """


""" class ListDisabledBlockView(generics.ListAPIView):
    serializer_class = DisabledBlocksSerializer

    def get_queryset(self):
        print(self.kwargs['day'])
        queryset = DisabledBlocks.objects.filter(day=self.kwargs['day'])
        return queryset """


@api_view(['POST'])
def create_block(request):

    disabled_block = DisabledBlocksSerializer(data=request.data)

    validations = [
        validate_create_disabled_block(request.data.get('day'), request.data.get('block'))
    ]
    
    error_msg = "\n".join([msg for valid, msg in validations if not valid])
    print(error_msg)

    if error_msg != "":
        return Response(data=error_msg, status=status.HTTP_400_BAD_REQUEST)

    if disabled_block.is_valid():
        day = disabled_block.data.get('day')
        block = disabled_block.data.get('block')

        queryset = DisabledBlocks.objects.filter(day=day, block=block)
        
        if queryset.exists():
            return Response(data="Ya existe una reserva en ese día y bloque", status=status.HTTP_226_IM_USED)
        else:
            disabled_blocks = DisabledBlocks(day=day, block=block)
            disabled_blocks.save()
            
            return Response(DisabledBlocksSerializer(disabled_blocks).data, status=status.HTTP_201_CREATED)

    return Response(data="There was an error in the creation of the disabled blocks", status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def view_blocks(request):

    if request.query_params:
        block = DisabledBlocks.objects.filter(**request.query_params.dict())
    else:
        block = DisabledBlocks.objects.all()

    print(block)
  
    if block:
        print("Entro al if")
        data = DisabledBlocksSerializer(block, many=True)
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def update_block(request, pk):
    disabled_block = DisabledBlocks.objects.get(pk=pk)
    data = DisabledBlocksSerializer(instance=disabled_block, data=request.data)
  
    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
def delete_block(request, pk):
    disabled_block = get_object_or_404(DisabledBlocks, pk=pk)
    disabled_block.delete()
    return Response(status=status.HTTP_202_ACCEPTED)


# ============================================ Days ============================================

""" class CreateDisabledDaysView(APIView):
    serializer_class = CreateDisabledDaysSerializer

    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            day = serializer.data.get('day')
            queryset = DisabledDays.objects.filter(day=day)
            
            if queryset.exists():
                return Response(data="Este día ya está bloqueado", status=status.HTTP_226_IM_USED)
            else:
                disabled_day = DisabledDays(day=day)
                disabled_day.save()
                
                return Response(DisabledDaysSerializer(disabled_day).data, status=status.HTTP_201_CREATED)

        return Response(data="There was an error in the creation of the disabled day", status=status.HTTP_400_BAD_REQUEST) """


@api_view(['POST'])
def create_day(request):

    disabled_day = DisabledDaysSerializer(data=request.data)

    validations = [
        validate_create_disabled_day(request.data.get('day'))
    ]

    error_msg = "\n".join([msg for valid, msg in validations if not valid])
    print(error_msg)

    if error_msg != "":
        return Response(data=error_msg, status=status.HTTP_400_BAD_REQUEST)

    if disabled_day.is_valid():
        day = disabled_day.data.get('day')
        queryset = DisabledDays.objects.filter(day=day)
        
        if queryset.exists():
            return Response(data="Este día ya está bloqueado", status=status.HTTP_226_IM_USED)
        else:
            disabled_day = DisabledDays(day=day)
            disabled_day.save()
            
            return Response(DisabledDaysSerializer(disabled_day).data, status=status.HTTP_201_CREATED)

    return Response(data="There was an error in the creation of the disabled day", status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def view_days(request):

    if request.query_params:
        days = DisabledDays.objects.filter(**request.query_params.dict())
    else:
        days = DisabledDays.objects.all()
  
    if days:
        data = DisabledDaysSerializer(days, many=True)
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def update_day(request, pk):
    disabled_day = DisabledDays.objects.get(pk=pk)
    data = DisabledDaysSerializer(instance=disabled_day, data=request.data)
  
    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
def delete_day(request, pk):
    disabled_day = get_object_or_404(DisabledDays, pk=pk)
    disabled_day.delete()
    return Response(status=status.HTTP_202_ACCEPTED)


""" class ListDisabledDayView(generics.ListAPIView):
    queryset = DisabledDays.objects.all()
    serializer_class = DisabledDaysSerializer """


# ============================================ Bookings ============================================

@api_view(['POST'])
def create_booking(request):

    print(request.data)
    booking = BookingSerializer(data=request.data)

    validations = [
        validate_create_booking_block(request.data.get('block')),
        validate_create_booking_visitants(request.data.get('visitants'), 10),
        validate_create_disabled_block(request.data.get('booking_date'), request.data.get('block'))
    ]

    error_msg = "\n".join([msg for valid, msg in validations if not valid])

    print(error_msg)

    if error_msg != "":
        return Response(data=error_msg, status=status.HTTP_400_BAD_REQUEST)

    if booking.is_valid():
        booking_date = booking.data.get('booking_date')
        block = booking.data.get('block')
        visitants = booking.data.get('visitants')
        group = booking.data.get('group')
        school = booking.data.get('school')
        price = booking.data.get('price')

        name = booking.data.get('name')
        lastname = booking.data.get('lastname')
        email = booking.data.get('email')
        cellphone = booking.data.get('cellphone')
        document_type = booking.data.get('document_type')
        document_number = booking.data.get('document_number')

        payment = requests.post(
            'http://localhost:8000/api/create-payment/', 
            data={
                "total": request.data.get('price')
            }
        )
        payment = Payment(**json.loads(payment.text))
        
        disabled_blocks = DisabledBlocks(day=booking_date, block=block)
        disabled_blocks.save()

        booking = Booking(
            booking_date=booking_date, 
            block=block, 
            visitants=visitants, 
            group=group,
            school=school,
            price=price, 
            
            name=name, 
            lastname=lastname,
            email=email, 
            cellphone=cellphone,
            document_type=document_type,
            document_number=document_number,

            payment=payment
        )
        booking.save()
        
        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)

    return Response(data="There was an error in the creation of the booking", status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def view_bookings(request):

    if request.query_params:
        bookings = Booking.objects.filter(**request.query_params.dict())
    else:
        bookings = Booking.objects.all()
  
    if bookings:
        data = BookingSerializer(bookings, many=True)
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def update_booking(request, pk):
    booking = Booking.objects.get(pk=pk)
    data = BookingSerializer(instance=booking, data=request.data)
  
    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
def delete_booking(request, pk):
    booking = get_object_or_404(Booking, pk=pk)
    block = get_object_or_404(DisabledBlocks, day=booking.booking_date, block=booking.block)
    block.delete()
    booking.delete()
    return Response(status=status.HTTP_202_ACCEPTED)


""" class CreateBookingView(APIView):
    serializer_class = CreateBookingSerializer

    def post(self, request, format=None):

        print(request.data)

        validations = []
        validations.append(
            validate_block(request.data.get('block')))
        
        for valid, msg in validations:
            if not valid:
                return Response(data=msg, status=status.HTTP_400_BAD_REQUEST)

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

        return Response(data="There was an error in the creation of the booking", status=status.HTTP_400_BAD_REQUEST) """