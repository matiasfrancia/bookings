from django.db import models


class Payment(models.Model):
    token = models.CharField(max_length=64)
    vci = models.CharField(max_length=50)
    amount = models.IntegerField()
    status = models.CharField(max_length=64)
    buy_order = models.CharField(max_length=26)
    session_id = models.CharField(max_length=61)
    card_number = models.CharField(max_length=19)
    accounting_date = models.CharField(max_length=4)
    transaction_date = models.CharField(max_length=24)
    authorization_code = models.CharField(max_length=6)
    payment_type_code = models.CharField(max_length=10)
    response_code = models.IntegerField()
    installments_amount = models.IntegerField(blank=True, null=True)
    installments_number = models.IntegerField()
    balance = models.IntegerField(blank=True, null=True)


class Booking(models.Model):

    code = models.CharField(max_length = 8, unique = True)
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


class TempBooking(models.Model):

    code = models.CharField(max_length = 8, unique = True)
    token = models.CharField(max_length=64)
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


class DisabledBlocks(models.Model):
    block = models.CharField(max_length = 11)
    day = models.DateField()

    def __str__(self):
        return str(self.day) + str(self.block)


class DisabledDays(models.Model):
    day = models.DateField()

    def __str__(self):
        return str(self.day)