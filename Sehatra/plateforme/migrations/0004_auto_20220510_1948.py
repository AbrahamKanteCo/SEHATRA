# Generated by Django 3.1.7 on 2022-05-10 16:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plateforme', '0003_auto_20220510_1924'),
    ]

    operations = [
        migrations.AddField(
            model_name='action',
            name='en_ligne',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='actualite',
            name='en_ligne',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='artiste',
            name='en_ligne',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='association',
            name='en_ligne',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='organisateur',
            name='en_ligne',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='video',
            name='en_ligne',
            field=models.BooleanField(default=False),
        ),
    ]
