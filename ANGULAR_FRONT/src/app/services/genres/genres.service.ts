import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { api_url } from '../../helpers/Constants';
import { Genre } from '../../interfaces/Genre';

@Injectable({
  providedIn: 'root'
})
export class GenresService {

  private BASE_URL = api_url.url + 'shop/genres/'

  constructor(private httpClient: HttpClient) {}

  getGenres(): Observable<Genre[]> {
    return this.httpClient.get<Genre[]>(this.BASE_URL)
  }

  createGenre(newGenre: Genre): Observable<Genre> {
    return this.httpClient.post<Genre>(this.BASE_URL, newGenre, { withCredentials: true });
  }

  updateGenre(genre: Genre): Observable<void> {
    return this.httpClient.put<void>(this.BASE_URL + genre.id + '/', genre, { withCredentials: true });
  }

  deleteGenre(genre: Genre): Observable<void> {
    return this.httpClient.delete<void>(this.BASE_URL + genre.id + '/', { withCredentials: true });
  }

  /**
   * Aquí utilizaré request<void> e indico el método http delete
   * porque usar httpClient.delete no permite incluir un body,
   * y necesito pasar el listado de los géneros a eliminar.
   */
  deleteGenresList(genreIds: number[]): Observable<void> {
    return this.httpClient.request<void>('delete', api_url.url + 'shop/bulk_delete_genres/', {
      withCredentials: true,
      body: { ids: genreIds }
    });
  }

}
