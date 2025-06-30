import { AuthService, UserProfile } from '@/app/services/auth';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, Signal, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChartColumnBig, lucideListChecks, lucidePanelLeft, lucideScanBarcode } from '@ng-icons/lucide';
import { BrnSheetCloseDirective, BrnSheetContentDirective, BrnSheetTriggerDirective } from '@spartan-ng/brain/sheet';
import {
  HlmSheetComponent,
  HlmSheetContentComponent
} from '@spartan-ng/helm/sheet';
import { LucideAngularModule } from 'lucide-angular';
import { Logo } from '../logo/logo';
import { ProfileMenu } from '../profile-menu/profile-menu';
import { HlmButtonDirective } from '../ui/ui-button-helm/src';
import { HlmIconDirective } from '../ui/ui-icon-helm/src';
import { HlmToggleDirective } from '../ui/ui-toggle-helm/src';
import { SidebarService } from './sidebar-service';
import { ToggleSidebarDirective } from './toggle-sidebar-directive';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    
    HlmButtonDirective,
    HlmToggleDirective,
    
    LucideAngularModule,
    HlmIconDirective,
    NgIcon,
    
    BrnSheetTriggerDirective,
    BrnSheetContentDirective,
    BrnSheetCloseDirective,
    HlmSheetComponent,
    HlmSheetContentComponent,
    
    ToggleSidebarDirective,
    ProfileMenu,
    Logo
  ],
  providers: [
    provideIcons({
      lucideListChecks,
      lucideChartColumnBig,
      lucideScanBarcode,
      lucidePanelLeft,
    }),
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout implements OnInit, OnDestroy {

  menuButtons = [
    { isActive: false, title: "Dashboard", url: "/", icon: 'lucideChartColumnBig', requiredRoles: ['ADMIN'] },
    { isActive: false, title: "Ordens de Serviço", url: "/service-orders", icon: 'lucideListChecks', requiredRoles: ['ADMIN'] },
    { isActive: false, title: "Produtos", url: "/products", icon: 'lucideScanBarcode', requiredRoles: ['ADMIN'] },
  ]
  userProfile?: UserProfile
  open!: Signal<boolean>
  isMobile!: Signal<boolean>

  @ViewChild('closeSheet') closeSheetBtn!: ElementRef<HTMLButtonElement>;

  constructor(
    private readonly sidebarSerice: SidebarService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.open = this.sidebarSerice.open
    this.isMobile = this.sidebarSerice.isMobile
    this.userProfile = this.authService.getUserProfile()
    this.setMenuButtonActive()

    this.router.events.subscribe((event) => {
      if (event.type == 1) this.setMenuButtonActive()
    })

  }


  private pageSizeListennerUnsubscriber!: Function

  ngOnInit(): void {
    this.pageSizeListennerUnsubscriber = this.sidebarSerice.startPageSizeListenner()
  }

  ngOnDestroy(): void {
    this.pageSizeListennerUnsubscriber()
  }


  getPageTitle() {
    return this.menuButtons.find(item => item.isActive)?.title
  }

  async navigate(url: string) {
    await this.router.navigate([url])
    this.setMenuButtonActive()
    if (this.isMobile()) this.closeSheetBtn.nativeElement.click();
  }

  setMenuButtonActive() {
    this.menuButtons = this.menuButtons.map(item => {
      item.isActive = item.url == this.router.url
      return item
    })
  }


}
