# Generated by Django 4.2.11 on 2024-05-17 16:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('social', '0004_friendship_state_alter_friendship_unique_together'),
    ]

    operations = [
        migrations.AlterField(
            model_name='friendship',
            name='friend1',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='first_friend', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='friendship',
            name='friend2',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='second_friend', to=settings.AUTH_USER_MODEL),
        ),
    ]
