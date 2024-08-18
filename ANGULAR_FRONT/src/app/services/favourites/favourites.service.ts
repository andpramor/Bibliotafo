import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { api_url } from '../../helpers/Constants';
import { Favourite } from '../../interfaces/Favourite';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  private BASE_URL = api_url.url + 'shop/favourites/'

  constructor(private httpClient: HttpClient) {}

  getFavouritesByUser(user: number): Observable<Favourite[]> {
    return this.httpClient.get<Favourite[]>(this.BASE_URL + '?user=' + user, { withCredentials: true })
  }

  addFavourite(user: number, book: number): Observable<Favourite>{
    return this.httpClient.post<Favourite>(this.BASE_URL, {'user':  user, 'book': book}, { withCredentials: true})
  }

  deleteFavourite(id: number): Observable<void>{
    return this.httpClient.delete<void>(this.BASE_URL + id + '/', { withCredentials: true });
  }
}
