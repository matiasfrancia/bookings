import json
import random
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect, render
from matplotlib.font_manager import json_dump
from rest_framework import generics, status
from django.utils.dateparse import parse_date
from rest_framework.decorators import api_view
import requests
from datetime import datetime

from .models import Booking, DisabledBlocks, DisabledDays, Payment, TempBooking
from .validations import validate_create_booking_block, validate_create_booking_booking_date, validate_create_booking_visitants, validate_create_disabled_block, validate_create_disabled_day, validate_create_payment
from .serializers import (
    BookingSerializer, 
    DisabledBlocksSerializer,
    DisabledDaysSerializer,
    PaymentSerializer,
    TempBookingSerializer
)

from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from transbank.error.transbank_error import TransbankError
from transbank.webpay.webpay_plus.transaction import Transaction

import string
import random

def generate_unique_code():
    
    length = 6

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k = length))
        if Booking.objects.filter(code = code).count() == 0:
            break

    return code

def generate_unique_session_id():

    while True:
        session_id = str(random.randrange(1000000, 99999999))
        if Payment.objects.filter(session_id = session_id).count() == 0:
            break

    return session_id


# ============================================ Auth ============================================

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]

    return Response(routes)


# ============================================ Temp Booking ============================================

@api_view(['POST'])
def create_temp_booking(request):

    print(request.data)
    booking = TempBookingSerializer(data=request.data)

    validations = [
        validate_create_booking_block(request.data.get('block')),
        validate_create_booking_visitants(request.data.get('visitants'), 10),
        validate_create_disabled_block(request.data.get('booking_date'), request.data.get('block')),
        validate_create_booking_booking_date(request.data.get('booking_date'))
    ]

    error_msg = "\n".join(["- " + msg for valid, msg in validations if not valid])
    print(error_msg)

    if error_msg != "":
        return Response(data={'error_msg': error_msg}, status=status.HTTP_400_BAD_REQUEST)

    if booking.is_valid():
        token = booking.data.get('token')
        code = booking.data.get('code')
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

        booking = TempBooking(
            token=token,
            code=code,
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
        )

        booking.save()
        
        return Response(TempBookingSerializer(booking).data, status=status.HTTP_201_CREATED)

    return Response(data="There was an error in the creation of the temp booking", status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def view_temp_bookings(request):

    if request.query_params:
        bookings = TempBooking.objects.filter(**request.query_params.dict())
    else:
        bookings = TempBooking.objects.all()
  
    if bookings:
        data = TempBookingSerializer(bookings, many=True)
        return Response(data.data)
    else:
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['DELETE'])
def delete_temp_booking(request):

    if request.query_params.get('token'):
        booking = TempBooking.objects.filter(token=request.query_params.get('token'))

        if booking.exists():
            booking.delete()
            return Response(status=status.HTTP_202_ACCEPTED)

    return Response(data={'error_msg': "La reserva que desea eliminar no existe"}, 
        status=status.HTTP_404_NOT_FOUND)


# ============================================ Payment ============================================


@api_view(['POST'])
def webpay_plus_create(request):

    print("Webpay Plus Transaction.create", request.data)
    buy_order = generate_unique_code()
    session_id = generate_unique_session_id()
    amount = request.data.get("amount")
    return_url = 'http://localhost:8000/api/webpay-plus/commit/'

    response = (Transaction()).create(buy_order, session_id, amount, return_url)

    print(response)

    return Response(data={"response": response, "buy_order": buy_order})


@api_view(['GET', 'POST'])
def webpay_plus_commit(request):

    print("Request:", request.data)

    if request.method != 'GET':
        # obtengo la orden de compra
        response = requests.post("http://localhost:8000/api/webpay-plus/status/", 
            data={"token": request.data['TBK_TOKEN']})
        payment_status = json.loads(response.text)
        print("Response status:", response)
        # elimino la reserva asociada a esa orden de compra
        requests.delete('http://localhost:8000/api/bookings/delete/?code=' + payment_status['buy_order'])
        # redirecciono al usuario a la vista de realizar reserva
        return HttpResponseRedirect(redirect_to='http://localhost:8000/bookings/')

    print("Request query params:", request.query_params)

    token = request.query_params.get("token_ws")
    base_url = 'http://localhost:8000/api'
    redirect_url = "http://localhost:8000/booking-error/"

    # obtenemos temp_booking para ver si está disponible el bloque seleccionado
    temp_booking = requests.get(base_url + '/temp-bookings/?token=' + token)
    print("\n\nTemp booking {}\n\n".format(json.loads(temp_booking.text)[0]))
    temp_booking = json.loads(temp_booking.text)[0]

    if Booking.objects.filter(
        block=temp_booking['block'], 
        booking_date=temp_booking['booking_date']).exists():

        return Response(data={"error": "Ya fue reservado el bloque seleccionado, "
            + "se cancelará el pago. En caso de algún inconveniente comunicarse directamente" 
            + "con nosotros a través de nuestros medios de contacto. Disculpe los inconvenientes."},
            status=status.HTTP_409_CONFLICT)
    else:
        print("\n\nTudo bem\n\n")

    try:
        response = (Transaction()).commit(token=token)
        print("response: {}".format(response))

        payment_data = response
        payment_data['token'] = token
        payment_data['card_number'] = response['card_detail']['card_number']

        print("\n\nPayment data:\n\n", payment_data)
        
        if payment_data['status'] == 'AUTHORIZED':
            # creamos una entrada payment en la base de datos
            payment = requests.post(base_url + '/create-payment/', data=payment_data)

            # creamos una entrada booking en la base de datos vinculada a payment
            temp_booking['payment'] = json.loads(payment.text)['id']
            del temp_booking['token']
            booking = requests.post(base_url + '/create-booking/', data=temp_booking)
            booking = json.loads(booking.text)
            print("\n\nBooking final creado:", booking, "\n\n")
            
            # seteamos esta variable para redireccionar al comprobante de compra
            redirect_url = "http://localhost:8000/comprobante/"

    except:
        print("La transacción realizada en webpay no fue exitosa, " 
            + "por lo tanto no se ha realizado el cobro, inténtelo nuevamente.")

    # eliminamos la fila de la tabla temp_booking a través del token de transacción
    try:
        requests.delete(base_url + '/temp-bookings/delete/?token=' + token)
    except:
        print("No se pudo eliminar la orden de reserva temporal")

    # TODO:generamos un comprobante de reserva

    # TODO:enviamos el comprobante de reserva a través del correo electrónico ingresado por el comprador

    # TODO:redireccionamos al comprobante de compra y reserva (comprobante o página de error)
    return HttpResponseRedirect(redirect_to="http://localhost:8000/")


@api_view(['POST'])
def webpay_plus_refund(request):

    token = request.data.get("token")
    amount = request.data.get("amount")
    print("refund for token_ws: {} by amount: {}".format(token, amount))

    try:
        response = (Transaction()).refund(token, amount)
        print("response: {}".format(response))
        return Response(
            data={
                "token": token, 
                "amount": amount,
                "refund": True,
                "response": "El reembolso se realizó correctamente"}, 
            status=status.HTTP_202_ACCEPTED)

    except TransbankError as e:
        print(e.message)

    return Response(
        data={
            "token": token, 
            "amount": amount,
            "refund": False,
            "error": "No se pudo realizar correctamente el reembolso"}, 
        status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST'])
def webpay_plus_status(request):

    token = request.data.get('token')
    
    try:
        response = (Transaction()).status(token)
        print("Status response:", response)

        return Response(data=response, status=status.HTTP_200_OK)

    except TransbankError as e:
        print("Error:", e)

    print("\n\nResponse transaction status:", response, "\n\n")

    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_payment(request):

    payment = PaymentSerializer(data=request.data)

    validations = [
        validate_create_payment(int(request.data.get('amount'))),
        # crear validación para que no existan 2 payments iguales (o con el mismo buy_order)
    ]
    
    error_msg = "\n".join(["- " + msg for valid, msg in validations if not valid])
    print(error_msg)

    if error_msg != "":
        return Response(data={'error_msg': error_msg}, status=status.HTTP_400_BAD_REQUEST)

    if payment.is_valid():

        payment.save()
        print("Payment serializer:", payment.data)
            
        return Response(data=payment.data, status=status.HTTP_201_CREATED)

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
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def update_payment(request, pk):
    payment = Payment.objects.get(pk=pk)
    data = PaymentSerializer(instance=payment, data=request.data)
  
    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_payment(request, pk):
    payment = get_object_or_404(Payment, pk=pk)
    payment.delete()
    return Response(status=status.HTTP_202_ACCEPTED)

    
# ============================================ Blocks ============================================

@api_view(['POST'])
def create_block(request):

    disabled_block = DisabledBlocksSerializer(data=request.data)
    print("Bloque: ", request.data.get('block'), " Día: ", request.data.get('day'))
    print("Bloques en la bd: ", DisabledBlocks.objects.filter(day=request.data.get('day'), block=request.data.get('block')))

    validations = [
        validate_create_disabled_block(request.data.get('day'), request.data.get('block'))
    ]
    
    error_msg = "\n".join(["- " + msg for valid, msg in validations if not valid])
    print(error_msg)

    if error_msg != "":
        return Response(data={'error_msg': error_msg}, status=status.HTTP_400_BAD_REQUEST)

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
        data = DisabledBlocksSerializer(block, many=True)
        return Response(data.data)
    else:
        return Response(json.dumps({}), status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def update_block(request, pk):
    disabled_block = DisabledBlocks.objects.get(pk=pk)
    data = DisabledBlocksSerializer(instance=disabled_block, data=request.data)
  
    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_block(request):
    disabled_block = DisabledBlocks.objects.get(day=request.query_params.get('day'), block=request.query_params.get('block'))
    booking_that_block = Booking.objects.filter(booking_date=request.query_params.get('day'), block=request.query_params.get('block'))
    print(booking_that_block)
    
    if disabled_block and not booking_that_block:
        disabled_block.delete()
        return Response(data={}, status=status.HTTP_202_ACCEPTED)
    elif disabled_block and booking_that_block:
        return Response(
            data={'error_msg': "- El bloque que se desea deshabilitar contiene una reserva, elimínela antes de ejecutar esta acción"}, 
            status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


# ============================================ Days ============================================

@api_view(['POST'])
def create_day(request):

    disabled_day = DisabledDaysSerializer(data=request.data)

    validations = [
        validate_create_disabled_day(request.data.get('day'))
    ]

    error_msg = "\n".join(["- " + msg for valid, msg in validations if not valid])
    print(error_msg)

    if error_msg != "":
        return Response(data={'error_msg': error_msg}, status=status.HTTP_400_BAD_REQUEST)

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
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def update_day(request, pk):
    disabled_day = DisabledDays.objects.get(pk=pk)
    data = DisabledDaysSerializer(instance=disabled_day, data=request.data)
  
    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_day(request):
    disabled_day = DisabledDays.objects.get(day=request.query_params.get('day'))
    if disabled_day:
        disabled_day.delete()
        return Response(status=status.HTTP_202_ACCEPTED)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


# ============================================ Bookings ============================================

@api_view(['POST'])
def create_booking(request):

    print(request.data)
    booking = BookingSerializer(data=request.data)

    validations = [
        validate_create_booking_block(request.data.get('block')),
        validate_create_booking_visitants(request.data.get('visitants'), 10),
        validate_create_disabled_block(request.data.get('booking_date'), request.data.get('block')),
        validate_create_booking_booking_date(request.data.get('booking_date'))
    ]

    error_msg = "\n".join(["- " + msg for valid, msg in validations if not valid])
    print(error_msg)

    if error_msg != "":
        return Response(data={'error_msg': error_msg}, status=status.HTTP_400_BAD_REQUEST)

    if booking.is_valid():
        code = booking.data.get('code')
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

        payment = Payment.objects.get(id=booking.data.get('payment'))
        
        disabled_blocks = DisabledBlocks(day=booking_date, block=block)
        disabled_blocks.save()

        booking = Booking(
            code=code,
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

            payment=payment,
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
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def update_booking(request, pk):
    booking = Booking.objects.get(pk=pk)
    data = BookingSerializer(instance=booking, data=request.data)
  
    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_booking(request):

    if request.query_params.get('code'):
        booking = Booking.objects.filter(code=request.query_params.get('code'))
    else:
        booking = Booking.objects.filter(booking_date=request.query_params.get('day'), block=request.query_params.get('block'))

    block = DisabledBlocks.objects.filter(day=booking.first().booking_date, block=booking.first().block)

    if booking.exists() and block.exists():

        payment = booking.first().payment

        response = requests.post("http://localhost:8000/api/webpay-plus/refund/", 
            data={"token": payment.token, "amount": payment.amount})

        print("Refund response:", json.loads(response.text))

        booking.delete()
        block.delete()
        return Response(status=status.HTTP_202_ACCEPTED)

    elif booking.exists() and not block.exists():
        return Response(data={'error_msg': "La reserva existe, pero el bloque se encuentra habilitado "
         + "(hay inconsistencia de los datos guardados en la base de datos)"}, 
         status=status.HTTP_409_CONFLICT)
         
    elif not booking.exists():
        return Response(data={'error_msg': "La reserva que desea eliminar no existe"}, 
            status=status.HTTP_404_NOT_FOUND)