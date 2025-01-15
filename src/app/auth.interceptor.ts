import { HttpClient, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { environment } from '../environments/environment.development';
import { RegistrationResponse } from './definitions';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const idToken = localStorage.getItem("id_token");
  const router = inject(Router);
  const http = inject(HttpClient);
  function refresh(res: RegistrationResponse) {
    localStorage.setItem('id_token', res.token);
    const reqWithHeader = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + idToken)
    });
    next(reqWithHeader);
  }

  if (idToken) {
    const reqWithHeader = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + idToken)
    });

    return next(reqWithHeader)
      .pipe(catchError(error => {
        if (error.status === 401) {
            http.get<RegistrationResponse>(environment.API_URL + "/account/refresh", {withCredentials: true})
            .pipe(catchError(error => {
              router.navigate(["login"]);
              return throwError (() => error);
            }))
            .subscribe(refresh)
            
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
