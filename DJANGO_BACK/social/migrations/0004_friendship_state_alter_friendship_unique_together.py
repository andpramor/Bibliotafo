# Generated by Django 4.2.11 on 2024-05-15 11:38

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('social', '0003_alter_review_unique_together'),
    ]

    operations = [
        migrations.AddField(
            model_name='friendship',
            name='state',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterUniqueTogether(
            name='friendship',
            unique_together={('friend1', 'friend2')},
        ),
    ]
