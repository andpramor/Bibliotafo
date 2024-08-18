from django.utils import timezone
from django.db import models
from django.core import validators
from accounts.models import MyUser

def get_deleted_user():
    return MyUser.objects.get_or_create(username='deleted', defaults={'email': 'deleted@example.com'})[0]
    
#Editorial
class Publisher(models.Model):
    publisher_name = models.CharField(max_length=50, unique=True)

    def __str__(self) -> str:
        return self.publisher_name

#Género
class Genre(models.Model):
    genre_name = models.CharField(max_length=50, unique=True)

    def __str__(self) -> str:
        return self.genre_name

#Tema
class Theme(models.Model):
    theme_name = models.CharField(max_length=50, unique=True) #París, Segunda Guerra Mundial... Para un filtro.

    def __str__(self) -> str:
        return self.theme_name

#Autor
class Author(models.Model):
    author_name = models.CharField(max_length=50)
    biography = models.TextField(max_length=5000)
    author_photo = models.ImageField(upload_to='author_profiles/', null=True, blank=True)

    def __str__(self) -> str:
        return self.author_name

#Libro
class Book(models.Model):
    title = models.CharField(max_length=50) #No tiene por qué ser único.
    ISBN = models.BigIntegerField(validators=[validators.MinValueValidator(1000000000000), validators.MaxValueValidator(9999999999999)], unique=True) #El ISBN es un número de 13 cifras, único.
    authors = models.ManyToManyField(Author)
    publisher = models.ForeignKey(Publisher, on_delete=models.PROTECT)
    publication_date = models.DateField()
    synopsis = models.TextField(max_length=5000)
    cover = models.ImageField(upload_to='book_covers/', null=True, blank=True)
    genres = models.ManyToManyField(Genre)
    themes = models.ManyToManyField(Theme)
    stock = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=8, decimal_places=2, validators=[validators.MinValueValidator(limit_value=0)])
    STYLE_CHOICES = (
        ('dura','Pasta dura'),
        ('blanda','Pasta blanda',),
        ('bolsillo','Bolsillo'),
    )
    style = models.CharField(max_length=20, choices=STYLE_CHOICES)

    def __str__(self):
        return self.title

#Venta
class Sale(models.Model):
    #Los precios incluyen IVA siempre.
    seller = models.ForeignKey(MyUser, related_name='sales_as_seller', on_delete=models.SET(get_deleted_user))
    buyer = models.ForeignKey(MyUser, related_name='sales_as_buyer', on_delete=models.SET(get_deleted_user))
    sale_date = models.DateTimeField(default=timezone.now)
    sale_done = models.BooleanField(default=False)

    # Uso los parámetros related_name y on_delete en las relaciones ForeignKey para especificar cómo acceder a las líneas de pedido desde una venta (related_name='sale_items') y qué hacer cuando se elimina una venta (on_delete=models.CASCADE). En este caso, las líneas de pedido se eliminarán automáticamente cuando se elimine la venta asociada, pero el vendedor y el comprador seguirán siendo usuarios(on_delete=models.PROTECT).
    # Por ejemplo, para obtener todas las ventas en las que un usuario específico ha sido el comprador, utilizaría sales_as_buyer para filtrar las ventas, usando algo como ventas_como_comprador = elusuarioquesea.sales_as_buyer.all(), en lugar de ventas_como_comprador = Sale.objects.filter(buyer=elusuarioquesea). No sé si lo prefiero, se supone que related_name ayuda a clarificar el código, ya veré si lo uso así o lo elimino más adelante.

#LíneaPedido
class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, related_name='sale_items', on_delete=models.SET(get_deleted_user))
    book = models.ForeignKey(Book, on_delete=models.PROTECT)
    units = models.IntegerField()
    cost = models.DecimalField(max_digits=8, decimal_places=2)

    #Decido guardar "cost" en la base de datos para tener consistencia histórica: Guardar el cost al momento de la venta asegura un registro del costo exacte en ese momento, sin que futuras variaciones en el precio del producto afecten los registros de las ventas ya realizadas.

#Favoritos
class Favourite(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['book','user']