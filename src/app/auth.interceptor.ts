import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const idToken = localStorage.getItem("id_token");

  if (idToken) {
    const reqWithHeader = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + idToken)
    });

    return next(reqWithHeader);
  } else {
    return next(req);
  }
};
