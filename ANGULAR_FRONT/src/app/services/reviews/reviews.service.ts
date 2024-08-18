import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { api_url } from '../../helpers/Constants';
import { Review } from '../../interfaces/Review';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  private BASE_URL = api_url.url + 'social/reviews/'

  constructor(private httpClient: HttpClient) {}

  getReviewsByBook(book: number): Observable<Review[]> {
    return this.httpClient.get<Review[]>(this.BASE_URL + '?book=' + book, { withCredentials: true })
  }

  getReviewsByUser(user: number): Observable<Review[]> {
    return this.httpClient.get<Review[]>(this.BASE_URL + '?user=' + user, { withCredentials: true })
  }

  addReview(user: number, book: number, comment: string): Observable<Review>{
    return this.httpClient.post<Review>(this.BASE_URL, {'user':  user, 'book': book, 'comment': comment}, { withCredentials: true})
  }

  deleteReview(id: number): Observable<void>{
    return this.httpClient.delete<void>(this.BASE_URL + id + '/', { withCredentials: true });
  }
}
