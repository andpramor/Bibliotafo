# Generated by Django 4.2.11 on 2024-05-13 18:15

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('social', '0002_rename_comment_review'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='review',
            unique_together={('book', 'user')},
        ),
    ]
