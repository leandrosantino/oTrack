import { Component, Signal } from '@angular/core';
import { Logo } from '../logo/logo';
import { LoadingStateService } from './loading-state-service';

@Component({
  selector: 'app-loading',
  imports: [Logo],
  templateUrl: './loading.html'
})
export class Loading {

  isLoading!: Signal<boolean>

  constructor(
    private readonly loadingStateService: LoadingStateService
  ) {
    this.isLoading = this.loadingStateService.isLoading
  }

}
