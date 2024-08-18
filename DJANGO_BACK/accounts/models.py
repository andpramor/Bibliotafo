from django.db import models
from django.core import validators
from django.contrib.auth.models import AbstractUser

#Utilizo el validador RegexValidator para utilizar una expresión regular para validar el formato del DNI.
dni_validator = validators.RegexValidator(
    regex=r'^\d{8}[A-Za-z]$',
    message='El DNI debe consistir en 8 números seguidos por una letra.', #Este mensaje lo devuelve Django si al validar la expresión, lo que haya introducido el usuario no cumple.
)

#Usuario
class MyUser(AbstractUser):
    dni = models.CharField(max_length=9, validators=[dni_validator], unique=True, null=True)
    address = models.CharField(max_length=50, null=True)
    phone = models.BigIntegerField(validators=[validators.MinValueValidator(100000000), validators.MaxValueValidator(999999999)], null=True)
    profile_picture = models.ImageField(upload_to='user_profiles/', null=True, blank=True)
    email = models.EmailField(unique=True, null=False, blank=False)

    ROL_CHOICES = [
        ('client', 'Client'),
        ('staff', 'Staff'), # Acceso a CRUD de ventas.
        ('manager','Manager'), # Acceso a CRUD de libros. ¿Y a crear otros Staff/Manager?
    ]
    rol = models.CharField(max_length=7, choices=ROL_CHOICES)

    # No añado un campo saldo ni compruebo que tenga saldo cuando compre, porque en teoría le enviaría a una pasarela de pago, tarjetazo y palante, o la pasarela da un timeout o cualquier otro error y no palante.

    def __str__(self) -> str:
        return self.username