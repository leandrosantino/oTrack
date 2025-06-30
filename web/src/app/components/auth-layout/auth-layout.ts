import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, Logo],
  templateUrl: './auth-layout.html'
})
export class AuthLayout {

}
