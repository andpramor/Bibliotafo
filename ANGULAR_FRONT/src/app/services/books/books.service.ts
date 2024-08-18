import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

import { api_url } from '../../helpers/Constants';
import { Book } from '../../interfaces/Book';
import { BookForBack } from '../../interfaces/BookForBack';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private BASE_URL = api_url.url + 'shop/books/'

  constructor(private httpClient: HttpClient) {}

  getBookById(id: number): Observable<Book> {
    return this.httpClient.get<Book>(this.BASE_URL+id+'/')
  }

  getBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(this.BASE_URL)
  }

  createBook(newBook: BookForBack, cover: File | null): Observable<BookForBack> {
    const formData: FormData = new FormData();

    formData.append('title', newBook.title);
    formData.append('ISBN', newBook.ISBN.toString());
    formData.append('publication_date', newBook.publication_date);
    formData.append('synopsis', newBook.synopsis);
    formData.append('stock', newBook.stock.toString());
    formData.append('price', newBook.price.toString());
    formData.append('style', newBook.style);
    formData.append('publisher', newBook.publisher!.toString());

    newBook.authors!.forEach((author) => {
      formData.append(`authors`, author.toString());
    });

    newBook.genres!.forEach((genre) => {
      formData.append(`genres`, genre.toString());
    });

    newBook.themes!.forEach((theme) => {
      formData.append(`themes`, theme.toString());
    });

    if (cover) {
      formData.append('cover', cover);
    }

    return this.httpClient.post<BookForBack>(this.BASE_URL, formData, { withCredentials: true });
  }

  updateBook(book: BookForBack, cover: File | null) {
    const formData: FormData = new FormData();

    formData.append('id', book.id!.toString());
    formData.append('title', book.title);
    formData.append('ISBN', book.ISBN.toString());
    formData.append('publication_date', book.publication_date);
    formData.append('synopsis', book.synopsis);
    formData.append('stock', book.stock.toString());
    formData.append('price', book.price.toString());
    formData.append('style', book.style);
    formData.append('publisher', book.publisher!.toString());
    book.authors!.forEach((author) => {
      formData.append('authors', author.toString())
    });
    book.genres!.forEach((genre) => {
      formData.append('genres', genre.toString())
    });
    book.themes!.forEach((theme) => {
      formData.append('themes', theme.toString())
    });

    if (cover) {
      formData.append('cover', cover);
    }

    return this.httpClient.patch(this.BASE_URL + book.id + '/', formData, { withCredentials: true });
  }

  deleteBook(book: Book): Observable<void> {
    return this.httpClient.delete<void>(this.BASE_URL + book.id + '/', { withCredentials: true });
  }

  /**
   * Aquí utilizaré request<void> e indico el método http delete
   * porque usar httpClient.delete no permite incluir un body,
   * y necesito pasar el listado de los libros a eliminar.
   */
  deleteBooksList(bookIds: number[]): Observable<void> {
    return this.httpClient.request<void>('delete', api_url.url + 'shop/bulk_delete_books/', {
      withCredentials: true,
      body: { ids: bookIds }
    });
  }

}
