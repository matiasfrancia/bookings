from django.shortcuts import get_object_or_404
from .models import Booking, DisabledBlocks

# Booking validations

def validate_create_booking_block(block):
    blocks = ["8:00-9:50", "10:00-11:50", "12:00-13:50", "16:00-17:50"]
    if(block not in blocks):
        return (False, "El formato del bloque es incorrecto")
    return (True, "El formato del bloque es correcto")

def validate_create_booking_visitants(visitants, inf_bound):
    if visitants <= inf_bound:
        return (False, "La cantidad de visitantes es menor a la permitida, el mínimo por reserva son " + str(inf_bound) + " vistantes")
    return (True, "La cantidad de visitantes de esta reserva es correcta")

# Disabled days validations

def validate_create_disabled_day(day):
    bookings = Booking.objects.filter(booking_date=day)
    if bookings.exists():
        return (False, "Existe al menos una reserva en este día, debe eliminarlas todas para deshabilitarlo")
    return (True, "Hasta el momento no hay ninguna reserva para este día, por lo que se puede deshabilitar")

# Disabled blocks validation

def validate_create_disabled_block(day, block):
    block = get_object_or_404(DisabledBlocks, day=day, block=block)
    if block:
        return (False, "Ya existe una reserva en este día y bloque, o ya se bloqueó previamente, si desea deshabilitarlo de todos modos primero debe eliminar la reserva")
    return (True, "No existe ninguna reserva en este día y bloque, ni se encuentra bloqueado ya, por lo que se puede deshabilitar")