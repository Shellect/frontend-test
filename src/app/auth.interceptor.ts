import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const idToken = localStorage.getItem("id_token");
  const router = inject(Router);

  if (idToken) {
    const reqWithHeader = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + idToken)
    });

    return next(reqWithHeader)
      .pipe(catchError(error => {
        if (error.status === 401) {
            console.log("TODO: сделать запрос на обновление")
        }
        return throwError(() => error);
      }));
  } else {
    return next(req)
      .pipe(catchError(error => {
        if (error.status === 401) {
          
          router.navigate(["registration"])
        }
        return throwError(() => error);
      }));
  }

  
};
