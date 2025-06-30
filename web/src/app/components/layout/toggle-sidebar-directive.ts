import { Directive, HostListener } from '@angular/core';
import { SidebarService } from './sidebar-service';

@Directive({
  selector: '[toggleSidebar]',
  exportAs: 'toggleSidebar'
})
export class ToggleSidebarDirective {

  constructor(
    private readonly sidebarService: SidebarService
  ) { }

  @HostListener('click') click() {
    this.sidebarService.toggle()
  }

}
