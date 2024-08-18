import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');
  
    if (token) {
      const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      console.log(authReq); //Para ver las peticiones que envío, para debugging
      return next.handle(authReq);

    } else {
      console.log(req);
      return next.handle(req);
    }
  }
}
