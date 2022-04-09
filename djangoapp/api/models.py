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

class Booking(models.Model):
    code = models.CharField(max_length = 8, default = generate_unique_code, unique = True)
    name = models.CharField(max_length = 120)
    email = models.EmailField(max_length = 254)
    creation_date = models.DateTimeField(auto_now_add = True)
    booking_date = models.DateField()
    block = models.CharField(max_length = 11)
    visitants = models.IntegerField()
    price = models.IntegerField()

class DisabledBlocks(models.Model):
    block = models.CharField(max_length = 11)
    day = models.DateField()

    def __str__(self):
        return str(self.day) + str(self.block)

class DisabledDays(models.Model):
    day = models.DateField()

    def __str__(self):
        return str(self.day)