# Generated by Django 4.0.2 on 2022-04-09 08:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_booking_payment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking',
            name='school',
            field=models.CharField(blank=True, max_length=120, null=True),
        ),
    ]
