from django.urls import path, include
from rest_framework import routers

from shop.views import Books, SaleList, CreateBook, ReadBook, UpdateBook, DeleteBook, Publishers, CreatePublisher, UpdatePublisher, DeletePublisher, Genres, CreateGenre, UpdateGenre, DeleteGenre, Themes, CreateTheme, UpdateTheme, DeleteTheme, Authors, CreateAuthor, ReadAuthor, UpdateAuthor, DeleteAuthor

from shop.api_views import AuthorsView, BulkDeleteAuthorView, BulkDeleteBookView, BulkDeleteGenreView, BulkDeletePublisherView, BulkDeleteSaleItemView, BulkDeleteThemeView, PublisherViewSet, GenreViewSet, SaleItemView, ThemeViewSet, SalesView, BooksView, FavouritesView

#Definimos el enrutador y añadimos los endpoints que trabajan con ViewSet:
router = routers.DefaultRouter()
router.register(r'publishers', PublisherViewSet)
router.register(r'genres', GenreViewSet)
router.register(r'themes', ThemeViewSet)

#__MONOLÍTICAS__
urlpatterns = [
    #Libros
    path('monolitica/books/',Books.as_view(),name='books'),
    path('monolitica/createBook/',CreateBook.as_view(),name='createBook'),
    path('monolitica/readBook/<pk>',ReadBook.as_view(),name='readBook'),
    path('monolitica/updateBook/<pk>',UpdateBook.as_view(),name='updateBook'),
    path('monolitica/deleteBook/<pk>',DeleteBook.as_view(),name='deleteBook'),
    #Editoriales
    path('monolitica/publishers/',Publishers.as_view(),name='publishers'),
    path('monolitica/createPublisher/',CreatePublisher.as_view(),name='createPublisher'),
    path('monolitica/updatePublisher/<pk>',UpdatePublisher.as_view(),name='updatePublisher'),
    path('monolitica/deletePublisher/<pk>',DeletePublisher.as_view(),name='deletePublisher'),
    #Géneros
    path('monolitica/genres/',Genres.as_view(),name='genres'),
    path('monolitica/createGenre/',CreateGenre.as_view(),name='createGenre'),
    path('monolitica/updateGenre/<pk>',UpdateGenre.as_view(),name='updateGenre'),
    path('monolitica/deleteGenre/<pk>',DeleteGenre.as_view(),name='deleteGenre'),
    #Temas
    path('monolitica/themes/',Themes.as_view(),name='themes'),
    path('monolitica/createTheme/',CreateTheme.as_view(),name='createTheme'),
    path('monolitica/updateTheme/<pk>',UpdateTheme.as_view(),name='updateTheme'),
    path('monolitica/deleteTheme/<pk>',DeleteTheme.as_view(),name='deleteTheme'),
    #Autores
    path('monolitica/authors/',Authors.as_view(),name='authors'),
    path('monolitica/createAuthor/',CreateAuthor.as_view(),name='createAuthor'),
    path('monolitica/readAuthor/<pk>',ReadAuthor.as_view(),name='readAuthor'),
    path('monolitica/updateAuthor/<pk>',UpdateAuthor.as_view(),name='updateAuthor'),
    path('monolitica/deleteAuthor/<pk>',DeleteAuthor.as_view(),name='deleteAuthor'),
    #CRUD Ventas
    path('monolitica/sales/',SaleList.as_view(),name='sales')
]

#____API____
urlpatterns += [
    path('', include(router.urls)),
    path('bulk_delete_publishers/', BulkDeletePublisherView.as_view(), name='bulk_delete_publishers'),
    path('bulk_delete_genres/', BulkDeleteGenreView.as_view(), name='bulk_delete_genres'),
    path('bulk_delete_themes/', BulkDeleteThemeView.as_view(), name='bulk_delete_themes'),
    path('bulk_delete_authors/', BulkDeleteAuthorView.as_view(), name='bulk_delete_authors'),
    path('bulk_delete_books/', BulkDeleteBookView.as_view(), name='bulk_delete_books'),
    path('books/<int:pk>/', BooksView.as_view()),
    path('books/', BooksView.as_view()),
    path('authors/<int:pk>/', AuthorsView.as_view()),
    path('authors/', AuthorsView.as_view()),
    path('sales/<int:pk>/', SalesView.as_view()),
    path('sales/saleItem/<int:pk>/', SaleItemView.as_view()),
    path('sales/saleItem/', SaleItemView.as_view(), name='new_item'),
    path('sales/bulk_delete_saleitems/', BulkDeleteSaleItemView.as_view(), name='new_item'),
    path('sales/', SalesView.as_view()),
    path('favourites/<int:pk>/', FavouritesView.as_view(), name='api_delete_favourite'),
    path('favourites/', FavouritesView.as_view(), name='api_favourites'),
]