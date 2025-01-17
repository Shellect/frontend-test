import { HttpClient, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { environment } from '../environments/environment.development';
import { RegistrationResponse } from './definitions';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const idToken = localStorage.getItem("id_token");
  const router = inject(Router);
  const http = inject(HttpClient);

  function addAuthHeader(req: HttpRequest<any>) {
    return req.clone({
      headers: req.headers.set("Authorization", "Bearer " + idToken)
    });
  }

  function refreshToken(res: RegistrationResponse): Observable<any> {
    // Обрабатываем полученный refresh token
    localStorage.setItem('id_token', res.token);
    return next(addAuthHeader(req));
  }

  if (idToken) {
    return next(addAuthHeader(req))
      .pipe(catchError((error) => {
        if (error.status === 401) {
          // Если auth JWT есть, но просрочен
          // Делаем refresh запрос
          http.get<RegistrationResponse>(environment.API_URL + "/account/refresh", { withCredentials: true })
            .pipe(catchError(() => {
              router.navigate(["login"]);
              return EMPTY;
            }))
            .subscribe(refreshToken);
        }
        return throwError(() => error);
      }))
      
  } else {
    return next(req)
      .pipe(catchError(error => {
        if (error.status === 401) {
          router.navigate(["login"]);
          return EMPTY;
        }
        return throwError(() => error);
      }));
  }


};
