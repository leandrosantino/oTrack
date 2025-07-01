import { HlmButtonDirective } from '@/app/components/ui/ui-button-helm/src';
import { HlmCheckboxComponent } from '@/app/components/ui/ui-checkbox-helm/src';
import { HlmInputDirective } from '@/app/components/ui/ui-input-helm/src';
import { GoogleSigninButtonDirective, SocialAuthService, SocialLoginModule } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [
    HlmButtonDirective, HlmInputDirective, HlmCheckboxComponent, ReactiveFormsModule, RouterLink,
    SocialLoginModule,  GoogleSigninButtonDirective
  ],
  templateUrl: './login.html',
})
export class Login implements OnInit {

  constructor(
    private readonly authService: AuthService,
    private socialAuthService: SocialAuthService,
    private readonly router: Router
  ) { }

  showPassword = false

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      console.log(user);
    });
  }

  readonly formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  get email() {
    return this.formGroup.get('email')
  }
  get password() {
    return this.formGroup.get('password')
  }

  async submitLogin(event: SubmitEvent) {
    event.preventDefault()

    if (!this.email?.value || !this.password?.value) return

    this.authService.login(this.email.value, this.password.value).subscribe({
      complete: () => this.router.navigate(['']),
      error: (err: Error) => {
        if (err.message === 'INVALID_PASSWORD') {
          this.password?.setErrors({ INVALID_PASSWORD: true }, { emitEvent: true })
        }
        if (err.message === 'USER_NOT_FOUND') {
          this.email?.setErrors({ USER_NOT_FOUND: true }, { emitEvent: true })
        }
      }
    })
  }

}
