# Generated by Django 4.2.11 on 2024-06-03 13:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0003_alter_book_publisher_alter_sale_buyer_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='author',
            name='biography',
            field=models.TextField(max_length=5000),
        ),
        migrations.AlterField(
            model_name='book',
            name='synopsis',
            field=models.TextField(max_length=5000),
        ),
    ]
