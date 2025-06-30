import { HlmButtonDirective } from '@/app/components/ui/ui-button-helm/src';
import { HlmCheckboxComponent } from '@/app/components/ui/ui-checkbox-helm/src';
import { HlmIconDirective } from '@/app/components/ui/ui-icon-helm/src';
import { HlmInputDirective } from '@/app/components/ui/ui-input-helm/src';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheckBig, lucideFrown } from '@ng-icons/lucide';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    HlmButtonDirective,
    HlmInputDirective,
    HlmCheckboxComponent,
    ReactiveFormsModule,
    LucideAngularModule,
    HlmIconDirective,
    NgIcon,
    RouterLink
  ],
  providers: [
    provideIcons({
      lucideFrown,
      lucideCircleCheckBig,
    })
  ],
  templateUrl: './reset-password.html',
})
export class ResetPassword {

  ticket!: string | null
  ticketIsValid = true
  makeRequest = false

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    route: ActivatedRoute,
  ) {
    this.ticket = route.snapshot.paramMap.get('ticket')
    if (this.ticket) {
      this.authService.resetPasswordTicketIsValid(this.ticket)
        .subscribe(({ isValid }) => {
          this.ticketIsValid = isValid
        })
    }
  }

  showPassword = false

  readonly formGroup = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  })

  get password() {
    return this.formGroup.get('password')
  }

  get confirmPassword() {
    return this.formGroup.get('confirmPassword')
  }

  async submitLogin(event: SubmitEvent) {
    event.preventDefault()

    if (!this.confirmPassword?.value || !this.password?.value) return

    if (this.password.value !== this.confirmPassword.value) {
      this.confirmPassword.setErrors({ passwordMismatchError: true }, { emitEvent: true })
      this.password.setErrors({ passwordMismatchError: true }, { emitEvent: true })
      return
    }

    if (!this.ticket) return

    this.authService.resetPassword(this.ticket, this.password.value).subscribe({
      complete: () => {
        this.makeRequest = true
      },
    })

  }

}
