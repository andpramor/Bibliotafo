import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api_url } from '../../helpers/Constants';
import { Observable } from 'rxjs';
import { Friendship } from '../../interfaces/Friendship';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  private BASE_URL = api_url.url + 'social/'

  constructor(private httpClient: HttpClient) {}

  getFriends(): Observable<Friendship[]> {
    return this.httpClient.get<Friendship[]>(this.BASE_URL + 'myfriendships/', { withCredentials: true })
  }

  getSent(): Observable<Friendship[]> {
    return this.httpClient.get<Friendship[]>(this.BASE_URL + 'myfriendships/?enviadas', { withCredentials: true })
  }

  getReceived(): Observable<Friendship[]> {
    return this.httpClient.get<Friendship[]>(this.BASE_URL + 'myfriendships/?recibidas', { withCredentials: true })
  }

  acceptRequest(id: number): Observable<Friendship>{
    return this.httpClient.post<Friendship>(this.BASE_URL + 'friendship_request_response/' + id + '/' , { withCredentials: true })
  }

  rejectRequest(id: number): Observable<void>{
    return this.httpClient.delete<void>(this.BASE_URL + 'friendship_request_response/' + id + '/', { withCredentials: true });
  }

  deleteFriend(id: number): Observable<void>{
    return this.httpClient.delete<void>(this.BASE_URL + 'friendships/' + id + '/', { withCredentials: true });
  }

  sendRequest(future_friend_id: number): Observable<any>{
    return this.httpClient.post<Friendship>(this.BASE_URL + 'friendship_request/' + future_friend_id + '/' , { withCredentials: true })
  }
}
