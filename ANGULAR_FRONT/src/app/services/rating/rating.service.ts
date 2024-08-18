import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { api_url } from '../../helpers/Constants';
import { Rating } from '../../interfaces/Rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private BASE_URL = api_url.url + 'social/ratings/'

  constructor(private httpClient: HttpClient) {}

  getRatingsByBook(book: number): Observable<Rating[]> {
    return this.httpClient.get<Rating[]>(this.BASE_URL + '?book=' + book, { withCredentials: true })
  }

  getRatingsByUser(user: number): Observable<Rating[]> {
    return this.httpClient.get<Rating[]>(this.BASE_URL + '?user=' + user, { withCredentials: true })
  }

  addRating(user: number, book: number, given_rating: number): Observable<Rating>{
    return this.httpClient.post<Rating>(this.BASE_URL, {'user':  user, 'book': book, 'given_rating': given_rating}, { withCredentials: true})
  }

  deleteRating(id: number): Observable<void>{
    return this.httpClient.delete<void>(this.BASE_URL + id + '/', { withCredentials: true });
  }
}
