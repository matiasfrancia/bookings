# Generated by Django 4.0.2 on 2022-04-08 20:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='disabledblocks',
            name='block',
            field=models.CharField(max_length=11),
        ),
    ]
