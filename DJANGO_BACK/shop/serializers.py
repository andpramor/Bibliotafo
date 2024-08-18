from rest_framework import serializers

from django.db.models import Avg

from shop.models import Publisher, Genre, Theme, Author, Book, Sale, SaleItem, Favourite
from social.models import Rating

class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = '__all__'

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'

class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    authornames = serializers.SerializerMethodField()
    genrenames = serializers.SerializerMethodField()
    themenames = serializers.SerializerMethodField()
    publishername = serializers.SerializerMethodField()
    authors = serializers.PrimaryKeyRelatedField(queryset=Author.objects.all(), many=True)
    genres = serializers.PrimaryKeyRelatedField(queryset=Genre.objects.all(), many=True)
    themes = serializers.PrimaryKeyRelatedField(queryset=Theme.objects.all(), many=True)
    publisher = serializers.PrimaryKeyRelatedField(queryset=Publisher.objects.all())
    avg_rating = serializers.SerializerMethodField(read_only=True)
    times_rated = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'authornames', 'authors', 'genrenames', 'genres', 'themenames', 'themes', 'title', 'ISBN', 'publisher', 'publishername', 'publication_date', 'synopsis', 'cover', 'stock', 'price', 'style', 'avg_rating', 'times_rated']
        extra_kwargs = {'cover': {'required': False}, 'avg_rating': {'required': False}, 'times_rated': {'required': False}}

    def get_authornames(self, book):
        authors = book.authors.all()
        return AuthorMiniSerializer(authors, many=True).data

    def get_genrenames(self, book):
        genres = book.genres.all()
        return GenreSerializer(genres, many=True).data

    def get_themenames(self, book):
        themes = book.themes.all()
        return ThemeSerializer(themes, many=True).data
    
    def get_publishername(self, book):
        return book.publisher.publisher_name
    
    def get_avg_rating(self, book):
        ratings = Rating.objects.filter(book=book)
        if ratings.exists():
            return ratings.aggregate(Avg('given_rating'))['given_rating__avg']
        return None
    
    def get_times_rated(self, book):
        ratings = Rating.objects.filter(book=book)
        if ratings.exists():
            return ratings.count()
        return 0

class BookMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'cover', 'ISBN', 'synopsis', 'price', 'stock']
        extra_kwargs = {'cover': {'required': False}}

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'
        extra_kwargs = {'author_photo': {'required': False}}

class AuthorMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'author_name']

class AuthorDetailSerializer(serializers.ModelSerializer):
    books = serializers.SerializerMethodField()

    class Meta:
        model = Author
        fields = ['author_name', 'biography', 'author_photo', 'books']
        extra_kwargs = {'author_photo': {'required': False}}

    def get_books(self, author):
        books = Book.objects.filter(authors=author)
        return BookMiniSerializer(books, many=True).data

class SaleFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = '__all__'

class SaleItemStandaloneSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleItem
        fields = ['sale','book','units','cost']

class SaleItemPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleItem
        fields = ['book','units','cost']

class SalePostSerializer(serializers.ModelSerializer):
    sale_items = SaleItemPostSerializer(many=True)

    class Meta:
        model = Sale
        fields = ['seller', 'buyer', 'sale_date', 'sale_items']
        extra_kwargs = {'seller': {'required': False}, 'buyer': {'required': False}}

    def validate_sale_items(self, value): #Al usar validate_nombredelcampo, DRF sabe que es para validar ese campo.
        if not value:
            raise serializers.ValidationError("Debe haber al menos un elemento en cada venta.")
        return value

class SaleItemGetSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title')
    cover = serializers.CharField(source='book.cover')

    class Meta:
        model = SaleItem
        fields = ['id', 'book', 'book_title', 'cover', 'units', 'cost']

class SaleGetSerializer(serializers.ModelSerializer):
    sale_items = SaleItemGetSerializer(many=True)

    class Meta:
        model = Sale
        fields = ['id', 'seller', 'buyer', 'sale_date', 'sale_items']

class FavouriteSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    cover = serializers.CharField(source='book.cover', read_only=True)

    class Meta:
        model = Favourite
        fields = ['id','user','book', 'book_title', 'cover']
        extra_kwargs = {'book_title': {'required': False}, 'cover': {'required': False}}