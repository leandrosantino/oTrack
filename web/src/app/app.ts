import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loading } from './components/loading/loading';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loading],
  template: `
    <app-loading>
      <router-outlet />
    </app-loading>
  `
})
export class App{ }
