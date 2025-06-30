import { HlmButtonDirective } from '@/app/components/ui/ui-button-helm/src';
import { HlmInputDirective } from '@/app/components/ui/ui-input-helm/src';
import { AuthService } from '@/app/services/auth';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMailCheck } from '@ng-icons/lucide';
import { LucideAngularModule } from 'lucide-angular';
import { HlmIconDirective } from "../../components/ui/ui-icon-helm/src/lib/hlm-icon.directive";

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    HlmButtonDirective,
    HlmInputDirective,
    ReactiveFormsModule,
    LucideAngularModule,
    HlmIconDirective,
    NgIcon
  ],
  providers: [
    provideIcons({
      lucideMailCheck
    })
  ],
  templateUrl: './forgot-password.html'
})
export class ForgotPassword {

  makeRequest = false

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  readonly formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  })

  get email() {
    return this.formGroup.get('email')
  }

  async submitLogin(event: SubmitEvent) {
    event.preventDefault()
    if (!this.email?.value) return
    this.authService.forgotPassword(this.email.value)
      .subscribe(() => {
        this.makeRequest = true
      })
  }

}