# Generated by Django 4.2.5 on 2023-10-30 15:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paiement', '0005_alter_billet_date_alter_paiement_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='billet',
            name='date',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='paiement',
            name='date',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
