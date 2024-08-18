from typing import Any
from django.views.generic import ListView, CreateView, DetailView, UpdateView, DeleteView
from django.db.models.query import QuerySet


from .models import Book, Publisher, Sale, Genre, Theme, Author
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required


#Libro:
class Books(ListView):
    model = Book
    template_name = 'shop/books/books.html'
    paginate_by = 6

    def get_queryset(self) -> QuerySet[Any]:
        queryset = Book.objects.all().order_by('title') #Ordeno por título
        return queryset

class CreateBook(CreateView):
    model = Book
    template_name = 'shop/books/createBook.html'
    fields = '__all__'
    success_url = reverse_lazy('books')

    # Personalizo los labels del formulario para que no salgan en inglés como los atributos de la clase:
    def get_form(self):
        form = super().get_form()
        form.fields['title'].label = 'Título'
        form.fields['authors'].label = 'Autores'
        form.fields['publisher'].label = 'Editorial'
        form.fields['publication_date'].label = 'Fecha de publicación'
        form.fields['synopsis'].label = 'Sinopsis'
        form.fields['cover'].label = 'Portada'
        form.fields['genres'].label = 'Géneros'
        form.fields['themes'].label = 'Temas'
        form.fields['stock'].label = 'Unidades'
        form.fields['style'].label = 'Estilo'
        return form

class ReadBook(DetailView):
    model = Book
    template_name = 'shop/books/readBook.html'

class UpdateBook(UpdateView):
    model = Book
    template_name = 'shop/books/updateBook.html'
    fields = '__all__'

    #Para volver al detalle tras actualizarlo:
    def get_success_url(self):
        book_id = self.object.pk
        return reverse_lazy('readBook', kwargs={'pk': book_id})

    # Personalizo los labels del formulario para que no salgan en inglés como los atributos de la clase:
    def get_form(self):
        form = super().get_form()
        form.fields['title'].label = 'Título'
        form.fields['authors'].label = 'Autores'
        form.fields['publisher'].label = 'Editorial'
        form.fields['publication_date'].label = 'Fecha de publicación'
        form.fields['synopsis'].label = 'Sinopsis'
        form.fields['cover'].label = 'Portada'
        form.fields['genres'].label = 'Géneros'
        form.fields['themes'].label = 'Temas'
        form.fields['stock'].label = 'Unidades'
        form.fields['style'].label = 'Estilo'
        return form

class DeleteBook(DeleteView):
    model = Book
    template_name = 'shop/books/deleteBook.html'
    success_url = reverse_lazy('books')

#Editorial:
class Publishers(ListView):
    model = Publisher
    template_name = 'shop/publishers/publishers.html'
    paginate_by = 10

    def get_queryset(self) -> QuerySet[Any]:
        queryset = Publisher.objects.all().order_by('publisher_name')
        return queryset

class CreatePublisher(CreateView):
    model = Publisher
    template_name = 'shop/publishers/createPublisher.html'
    fields = '__all__'
    success_url = reverse_lazy('publishers')

    def get_form(self):
        form = super().get_form()
        form.fields['publisher_name'].label = 'Nombre de la editorial'
        return form

class UpdatePublisher(UpdateView):
    model = Publisher
    template_name = 'shop/publishers/updatePublisher.html'
    fields = '__all__'
    success_url = reverse_lazy('publishers')

    def get_form(self):
        form = super().get_form()
        form.fields['publisher_name'].label = 'Nombre de la editorial'
        return form

class DeletePublisher(DeleteView):
    model = Publisher
    template_name = 'shop/publishers/deletePublisher.html'
    success_url = reverse_lazy('publishers') 

#Género:
class Genres(ListView):
    model = Genre
    template_name = 'shop/genres/genres.html'
    paginate_by = 10

    def get_queryset(self) -> QuerySet[Any]:
        queryset = Genre.objects.all().order_by('genre_name')
        return queryset

class CreateGenre(CreateView):
    model = Genre
    template_name = 'shop/genres/createGenre.html'
    fields = '__all__'
    success_url = reverse_lazy('genres')

    def get_form(self):
        form = super().get_form()
        form.fields['genre_name'].label = 'Nombre del género'
        return form

class UpdateGenre(UpdateView):
    model = Genre
    template_name = 'shop/genres/updateGenre.html'
    fields = '__all__'
    success_url = reverse_lazy('genres')

    def get_form(self):
        form = super().get_form()
        form.fields['genre_name'].label = 'Nombre del género'
        return form

class DeleteGenre(DeleteView):
    model = Genre
    template_name = 'shop/genres/deleteGenre.html'
    success_url = reverse_lazy('genres') 

#Tema:
class Themes(ListView):
    model = Theme
    template_name = 'shop/themes/themes.html'
    paginate_by = 10

    def get_queryset(self) -> QuerySet[Any]:
        queryset = Theme.objects.all().order_by('theme_name')
        return queryset

class CreateTheme(CreateView):
    model = Theme
    template_name = 'shop/themes/createTheme.html'
    fields = '__all__'
    success_url = reverse_lazy('themes')

    def get_form(self):
        form = super().get_form()
        form.fields['theme_name'].label = 'Nombre del tema'
        return form

class UpdateTheme(UpdateView):
    model = Theme
    template_name = 'shop/themes/updateTheme.html'
    fields = '__all__'
    success_url = reverse_lazy('themes')

    def get_form(self):
        form = super().get_form()
        form.fields['theme_name'].label = 'Nombre del tema'
        return form

class DeleteTheme(DeleteView):
    model = Theme
    template_name = 'shop/themes/deleteTheme.html'
    success_url = reverse_lazy('themes') 

#Autor:
class Authors(ListView):
    model = Author
    template_name = 'shop/authors/authors.html'
    paginate_by = 5

    def get_queryset(self) -> QuerySet[Any]:
        queryset = Author.objects.all().order_by('author_name')
        return queryset

class CreateAuthor(CreateView):
    model = Author
    template_name = 'shop/authors/createAuthor.html'
    fields = '__all__'
    success_url = reverse_lazy('authors')

    def get_form(self):
        form = super().get_form()
        form.fields['author_name'].label = 'Nombre del autor'
        form.fields['biography'].label = 'Biografía'
        form.fields['author_photo'].label = 'Fotografía'
        return form

class ReadAuthor(DetailView):
    model = Author
    template_name = 'shop/authors/readAuthor.html'

class UpdateAuthor(UpdateView):
    model = Author
    template_name = 'shop/authors/updateAuthor.html'
    fields = '__all__'

    #Para volver al detalle tras actualizarlo:
    def get_success_url(self):
        author_id = self.object.pk
        return reverse_lazy('readAuthor', kwargs={'pk': author_id})

    def get_form(self):
        form = super().get_form()
        form.fields['author_name'].label = 'Nombre del autor'
        form.fields['biography'].label = 'Biografía'
        form.fields['author_photo'].label = 'Fotografía'
        return form

class DeleteAuthor(DeleteView):
    model = Author
    template_name = 'shop/authors/deleteAuthor.html'
    success_url = reverse_lazy('authors')


#Venta:
@method_decorator(login_required, name='dispatch')
class SaleList(ListView):
    model = Sale
    template_name = 'shop/sales/saleList.html'
    paginate_by = 10

    def get_queryset(self) -> QuerySet[Any]:
        queryset = Sale.objects.all().order_by('-sale_date') #Ordeno por fecha
        return queryset