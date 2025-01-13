import { HttpClient, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { environment } from '../environments/environment.development';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const idToken = localStorage.getItem("id_token");
  const router = inject(Router);
  const http = inject(HttpClient);

  if (idToken) {
    const reqWithHeader = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + idToken)
    });

    return next(reqWithHeader)
      .pipe(catchError(error => {
        if (error.status === 401) {
            http.get(environment.API_URL + "/account/refresh")
        }
        return throwError(() => error);
      }));
  } else {
    return next(req)
      .pipe(catchError(error => {
        if (error.status === 401) {
          router.navigate(["login"])
        }
        return throwError(() => error);
      }));
  }

  
};
