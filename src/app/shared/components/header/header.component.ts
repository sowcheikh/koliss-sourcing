import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

import { NAV_ITEMS } from '../../../core/config/site.config';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../button/button.component';

/** En-tête : logo, navigation, recherche globale, état auth et CTA devis. */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, ButtonComponent],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  protected readonly navItems = NAV_ITEMS;
  protected readonly menuOpen = signal(false);
  protected readonly user = this.auth.user;

  protected readonly initials = computed(() => {
    const user = this.user();
    if (!user) {
      return '';
    }
    const f = user.firstName?.trim().charAt(0) ?? '';
    const l = user.lastName?.trim().charAt(0) ?? '';
    const nameInit = `${f}${l}`.toUpperCase();
    if (nameInit) {
      return nameInit;
    }
    return user.email?.trim().charAt(0).toUpperCase() || '?';
  });

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOpen.set(false));
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  @HostListener('document:keydown.escape')
  protected closeMenu(): void {
    this.menuOpen.set(false);
  }


  protected handleLogout(): void {
    void this.auth.logout();
    this.menuOpen.set(false);
  }
}
