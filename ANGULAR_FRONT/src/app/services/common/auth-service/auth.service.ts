import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { LoginResponse } from '../../../interfaces/LoginResponse';
import { LoginRequest } from '../../../interfaces/LoginRequest';
import { api_url } from '../../../helpers/Constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private BASE_URL = api_url.url

  private LOGIN_URL = this.BASE_URL + 'accounts/login/'

  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  private profilePic$ = new BehaviorSubject<string | null>(this.localProfilePic());
  private userRol$ = new BehaviorSubject<string | null>(this.localRol());

  constructor(private http: HttpClient, private router: Router) { }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.LOGIN_URL, request);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_rol');
    localStorage.removeItem('sale');
    localStorage.removeItem('profile_pic')
    localStorage.removeItem('user_id')
    this.profilePic$.next('');
    this.loggedIn$.next(false);
    this.userRol$.next(null);
    this.router.navigate(['']);
  }

  getLoginStatus(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  getProfilePic(): Observable<string | null> {
    return this.profilePic$.asObservable();
  }

  getUserRol(): Observable<string | null> {
    return this.userRol$.asObservable();
  }

  setLoggedIn(value: boolean) {
    this.loggedIn$.next(value);
  }

  setProfilePic(value: string) {
    this.profilePic$.next(value);
  }

  setUserRol(value: string | null) {
    this.userRol$.next(value);
  }

  hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  localRol(): string | null {
    return localStorage.getItem('user_rol');
  }

  localProfilePic(): string | null {
    return localStorage.getItem('profile_pic');
  }
  
}
