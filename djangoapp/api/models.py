from datetime import datetime
from enum import unique
from django.db import models
import string
import random

def generate_unique_code():
    
    length = 6

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k = length))
        if Booking.objects.filter(code = code).count() == 0:
            break

    return code


class Buyer(models.Model):
    rut = models.CharField(max_length = 15, unique=True)
    name = models.CharField(max_length = 120)
    email = models.EmailField(max_length = 254)
    created_date = models.DateTimeField(auto_now_add = True)

    def __str__(self) -> str:
        return self.name + ", " + self.rut

class Booking(models.Model):
    code = models.CharField(max_length = 8, default = generate_unique_code, unique = True)
    creation_date = models.DateTimeField(auto_now_add = True)
    booking_date = models.DateField()
    block = models.IntegerField()
    visitants = models.IntegerField()
    price = models.IntegerField()
    buyer = models.ForeignKey(Buyer, on_delete = models.CASCADE)
