import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

type ApiError = { type: string, messsage: string }

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const httpClient = inject(HttpClient)

  const newReq = req.clone({
    url: 'http://localhost:3000' + req.url,
    withCredentials: true,
    headers: req.headers.append('Authorization', 'Bearer ' + authService.getToken())
  })

  return next(newReq).pipe(
    catchError(httpError => {
      if (!(httpError instanceof HttpErrorResponse)) return EMPTY
      const errorData = httpError.error as ApiError

      if (req.url === '/auth/refresh' && errorData.type === 'EXPIRED_TOKEN') {
        authService.logout()
        return throwError(() => new Error(errorData.type))
      }

      if (errorData.type === 'EXPIRED_TOKEN') {
        return authService.restoreSession().pipe(
          switchMap(() => httpClient.request(req))
        )
      }
      // console.log(httpError)
      return throwError(() => new Error(errorData.type))
    }),
  )

}
