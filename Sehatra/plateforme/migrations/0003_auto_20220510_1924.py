# Generated by Django 3.1.7 on 2022-05-10 16:24

from django.db import migrations, models
import django_resized.forms
import plateforme.models


class Migration(migrations.Migration):

    dependencies = [
        ('plateforme', '0002_auto_20220510_1636'),
    ]

    operations = [
        migrations.AddField(
            model_name='action',
            name='slug',
            field=models.SlugField(blank=True, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='artiste',
            name='slug',
            field=models.SlugField(blank=True, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='association',
            name='slug',
            field=models.SlugField(blank=True, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='organisateur',
            name='slug',
            field=models.SlugField(blank=True, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='video',
            name='a_la_une',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='video',
            name='lien_video',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='video',
            name='photo_de_couverture',
            field=django_resized.forms.ResizedImageField(blank=True, crop=['middle', 'center'], force_format='PNG', keep_meta=True, null=True, quality=100, size=[1920, 1080], upload_to=plateforme.models.upload_to),
        ),
        migrations.AddField(
            model_name='video',
            name='slug',
            field=models.SlugField(blank=True, null=True, unique=True),
        ),
    ]
