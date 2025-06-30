import { AuthService, UserProfile } from '@/app/services/auth';
import { Component, Signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown, lucideCog, lucideKeyboard, lucideLayers, lucideLogOut, lucideUser } from '@ng-icons/lucide';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent
} from '@spartan-ng/helm/menu';
import { SidebarService } from '../layout/sidebar-service';
import { HlmAvatarComponent, HlmAvatarFallbackDirective, HlmAvatarImageDirective } from '../ui/ui-avatar-helm/src';
import { HlmButtonDirective } from '../ui/ui-button-helm/src';
import { HlmIconDirective } from '../ui/ui-icon-helm/src';

@Component({
  selector: 'app-profile-menu',
  imports: [
    BrnMenuTriggerDirective,
    HlmButtonDirective,

    HlmMenuComponent,
    HlmMenuItemDirective,
    HlmMenuLabelComponent,
    HlmMenuShortcutComponent,
    HlmMenuSeparatorComponent,
    HlmMenuItemIconDirective,
    HlmMenuGroupComponent,

    HlmAvatarImageDirective,
    HlmAvatarComponent,
    HlmAvatarFallbackDirective,

    HlmIconDirective,
    NgIcon,
  ],
  providers: [
    provideIcons({
      lucideLayers,
      lucideUser,
      lucideChevronsUpDown,
      lucideCog,
      lucideKeyboard,
      lucideLogOut,
    })
  ],
  templateUrl: './profile-menu.html'
})
export class ProfileMenu {
  userProfile?: UserProfile
  open!: Signal<boolean>

  constructor(
    private readonly sidebarSerice: SidebarService,
    private readonly authService: AuthService
  ) {
    this.open = this.sidebarSerice.open
    this.userProfile = this.authService.getUserProfile()
  }

  logout() {
    this.authService.logout()
  }
}
