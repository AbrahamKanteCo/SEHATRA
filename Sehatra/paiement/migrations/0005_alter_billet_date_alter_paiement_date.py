# Generated by Django 4.2.5 on 2023-10-30 15:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paiement', '0004_paiement_telephone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='billet',
            name='date',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='paiement',
            name='date',
            field=models.DateTimeField(),
        ),
    ]