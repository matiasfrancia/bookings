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

class Payment(models.Model):
    total = models.IntegerField()
    # Payment details ...

class Booking(models.Model):

    code = models.CharField(max_length = 8, default = generate_unique_code, unique = True)
    creation_date = models.DateTimeField(auto_now_add = True)
    
    booking_date = models.DateField()
    block = models.CharField(max_length = 11)
    visitants = models.IntegerField()
    group = models.CharField(max_length = 20)
    school = models.CharField(max_length = 120, blank=True, null=True)
    price = models.IntegerField()

    name = models.CharField(max_length = 120)
    lastname = models.CharField(max_length = 120)
    email = models.EmailField(max_length = 254)
    cellphone = models.CharField(max_length = 20)
    document_type = models.CharField(max_length=20)
    document_number = models.CharField(max_length=30)

    payment = models.ForeignKey(Payment, on_delete=models.DO_NOTHING, blank=True, null=True)

class DisabledBlocks(models.Model):
    block = models.CharField(max_length = 11)
    day = models.DateField()

    def __str__(self):
        return str(self.day) + str(self.block)

class DisabledDays(models.Model):
    day = models.DateField()

    def __str__(self):
        return str(self.day)