import { Component, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../layout/sidebar-service';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  templateUrl: './logo.html',
})
export class Logo {

  sideBarOpen!: Signal<boolean>

  constructor(
    private readonly sidebarSerice: SidebarService,
  ) {
    this.sideBarOpen = this.sidebarSerice.open
  }

}
