import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingStateService {

  private _isLoading = signal(false)

  isLoading = this._isLoading.asReadonly()

  setIsLoading(value: boolean) {
    this._isLoading.set(value)
  }
}
