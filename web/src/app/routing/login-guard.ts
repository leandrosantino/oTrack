import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { LoadingStateService } from '../components/loading/loading-state-service';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly loadingStateService: LoadingStateService
  ) { }

  canActivate: CanActivateFn = () => {
    if (this.authService.isAuth()) {
      this.router.navigate([''])
      return of(false)
    }

    this.loadingStateService.setIsLoading(true)
    return this.authService.restoreSession().pipe(
      switchMap(() => {
        this.router.navigate([''])
        return of(false)
      }),
      catchError(() => of(true)),
      finalize(() => this.loadingStateService.setIsLoading(false))
    )
  }

}