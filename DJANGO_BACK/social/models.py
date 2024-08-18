from django.db import models
from shop.models import Book, MyUser
from django.core.validators import MinValueValidator, MaxValueValidator

class Rating(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    given_rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)]) #Valoración de 1 a 5 estrellas.

    class Meta:
        unique_together = ['book','user']

class Review(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    comment = models.TextField(max_length=500)

    class Meta:
        unique_together = ['book','user']

class Friendship(models.Model):
    friend1 = models.ForeignKey(MyUser, related_name='first_friend', on_delete=models.CASCADE)
    friend2 = models.ForeignKey(MyUser, related_name='second_friend', on_delete=models.CASCADE)
    state = models.BooleanField(default=False)

    class Meta:
        unique_together = ['friend1','friend2']

    #Al mandar la petición, se crea la amistad con state False. Si el otro usuario la acepta, se pone state True. Si la rechaza, se elimina la solicitud.
    #Establecida la amistad, cada usuario puede eliminarla dejando de ser amigo del otro.
    #No se puede pedir amistad a alguien si ya está pendiente de responder, ni pedirsela al que te la ha pedido, simplemente se acepta. Si se rechaza, si puede volverse a pedir. Sólo los usuarios registrados pueden ser amigos.