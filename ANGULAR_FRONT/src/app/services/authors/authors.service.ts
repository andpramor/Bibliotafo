import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { api_url } from '../../helpers/Constants';
import { Author } from '../../interfaces/Author';
import { AuthorDetail } from '../../interfaces/AuthorDetail';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  private BASE_URL = api_url.url + 'shop/authors/'

  constructor(private httpClient: HttpClient) {}

  getAuthorById(id: number): Observable<AuthorDetail> {
    return this.httpClient.get<AuthorDetail>(this.BASE_URL+id+'/')
  }

  getAuthors(): Observable<Author[]> {
    return this.httpClient.get<Author[]>(this.BASE_URL)
  }

  createAuthor(newAuthor: Author, author_photo: File | null): Observable<Author> {
    const formData: FormData = new FormData();

    formData.append('author_name', newAuthor.author_name);
    formData.append('biography', newAuthor.biography);

    if (author_photo) {
      formData.append('author_photo', author_photo);
    }

    return this.httpClient.post<Author>(this.BASE_URL, formData, { withCredentials: true });
  }

  updateAuthor(author: Author, author_photo: File | null) {
    const formData: FormData = new FormData();

    formData.append('id', author.id!.toString());
    formData.append('author_name', author.author_name);
    formData.append('biography', author.biography);

    if (author_photo) {
      formData.append('author_photo', author_photo);
    }

    return this.httpClient.patch(this.BASE_URL + author.id + '/', formData, { withCredentials: true });
  }

  deleteAuthor(author: Author): Observable<void> {
    return this.httpClient.delete<void>(this.BASE_URL + author.id + '/', { withCredentials: true });
  }

  /**
   * Aquí utilizaré request<void> e indico el método http delete
   * porque usar httpClient.delete no permite incluir un body,
   * y necesito pasar el listado de los autores a eliminar.
   */
  deleteAuthorsList(authorIds: number[]): Observable<void> {
    return this.httpClient.request<void>('delete', api_url.url + 'shop/bulk_delete_authors/', {
      withCredentials: true,
      body: { ids: authorIds }
    });
  }

}
