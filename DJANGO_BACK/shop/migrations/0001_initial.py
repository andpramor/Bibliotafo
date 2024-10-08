# Generated by Django 4.2.11 on 2024-04-18 09:59

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('author_name', models.CharField(max_length=50)),
                ('biography', models.TextField(max_length=500)),
                ('author_photo', models.ImageField(blank=True, null=True, upload_to='author_profiles/')),
            ],
        ),
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('ISBN', models.BigIntegerField(unique=True, validators=[django.core.validators.MinValueValidator(1000000000000), django.core.validators.MaxValueValidator(9999999999999)])),
                ('publication_date', models.DateField()),
                ('synopsis', models.TextField(max_length=500)),
                ('cover', models.ImageField(blank=True, null=True, upload_to='book_covers/')),
                ('stock', models.PositiveIntegerField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=8, validators=[django.core.validators.MinValueValidator(limit_value=0)])),
                ('style', models.CharField(choices=[('dura', 'Pasta dura'), ('blanda', 'Pasta blanda'), ('bolsillo', 'Bolsillo')], max_length=20)),
                ('authors', models.ManyToManyField(to='shop.author')),
            ],
        ),
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('genre_name', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Publisher',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('publisher_name', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Sale',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sale_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('buyer', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='sales_as_buyer', to=settings.AUTH_USER_MODEL)),
                ('seller', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='sales_as_seller', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Theme',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('theme_name', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='SaleItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('units', models.IntegerField()),
                ('cost', models.DecimalField(decimal_places=2, max_digits=8)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='shop.book')),
                ('sale', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sale_items', to='shop.sale')),
            ],
        ),
        migrations.AddField(
            model_name='book',
            name='genres',
            field=models.ManyToManyField(to='shop.genre'),
        ),
        migrations.AddField(
            model_name='book',
            name='publisher',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shop.publisher'),
        ),
        migrations.AddField(
            model_name='book',
            name='themes',
            field=models.ManyToManyField(to='shop.theme'),
        ),
    ]
