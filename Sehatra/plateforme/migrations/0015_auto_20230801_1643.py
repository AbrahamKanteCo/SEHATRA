# Generated by Django 3.1.7 on 2023-08-01 13:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plateforme', '0014_test_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='action',
            name='lien_details',
            field=models.URLField(null=True),
        ),
        migrations.AddField(
            model_name='action',
            name='lien_don',
            field=models.URLField(null=True),
        ),
        migrations.AddField(
            model_name='association',
            name='lien_don',
            field=models.URLField(null=True),
        ),
        migrations.AddField(
            model_name='video',
            name='is_film',
            field=models.BooleanField(default=False),
        ),
    ]
