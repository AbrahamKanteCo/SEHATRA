# Generated by Django 3.1.7 on 2023-05-28 18:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plateforme', '0013_live_debut'),
    ]

    operations = [
        migrations.AddField(
            model_name='test',
            name='type',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
