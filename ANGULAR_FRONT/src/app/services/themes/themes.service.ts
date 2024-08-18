import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { api_url } from '../../helpers/Constants';
import { Theme } from '../../interfaces/Theme';

@Injectable({
  providedIn: 'root'
})
export class ThemesService {

  private BASE_URL = api_url.url + 'shop/themes/'

  constructor(private httpClient: HttpClient) {}

  getThemes(): Observable<Theme[]> {
    return this.httpClient.get<Theme[]>(this.BASE_URL)
  }

  createTheme(newTheme: Theme): Observable<Theme> {
    return this.httpClient.post<Theme>(this.BASE_URL, newTheme, { withCredentials: true });
  }

  updateTheme(theme: Theme): Observable<void> {
    return this.httpClient.put<void>(this.BASE_URL + theme.id + '/', theme, { withCredentials: true });
  }

  deleteTheme(theme: Theme): Observable<void> {
    return this.httpClient.delete<void>(this.BASE_URL + theme.id + '/', { withCredentials: true });
  }

  /**
   * Aquí utilizaré request<void> e indico el método http delete
   * porque usar httpClient.delete no permite incluir un body,
   * y necesito pasar el listado de los géneros a eliminar.
   */
  deleteThemesList(themeIds: number[]): Observable<void> {
    return this.httpClient.request<void>('delete', api_url.url + 'shop/bulk_delete_themes/', {
      withCredentials: true,
      body: { ids: themeIds }
    });
  }

}
