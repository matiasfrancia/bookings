# Generated by Django 4.0.2 on 2022-04-09 06:25

import api.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DisabledBlocks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('block', models.CharField(max_length=11)),
                ('day', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='DisabledDays',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(default=api.models.generate_unique_code, max_length=8, unique=True)),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('booking_date', models.DateField()),
                ('block', models.CharField(max_length=11)),
                ('visitants', models.IntegerField()),
                ('group', models.CharField(max_length=20)),
                ('school', models.CharField(max_length=120)),
                ('price', models.IntegerField()),
                ('name', models.CharField(max_length=120)),
                ('lastname', models.CharField(max_length=120)),
                ('email', models.EmailField(max_length=254)),
                ('cellphone', models.CharField(max_length=20)),
                ('document_type', models.CharField(max_length=20)),
                ('document_number', models.CharField(max_length=30)),
                ('payment', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.payment')),
            ],
        ),
    ]
