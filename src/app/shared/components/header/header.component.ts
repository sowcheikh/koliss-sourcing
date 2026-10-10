import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

import { NAV_ITEMS } from '../../../core/config/site.config';
import { ButtonComponent } from '../button/button.component';

/** En-tête : logo, navigation, recherche globale et CTA devis (menu burger sous 1280px). */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, ButtonComponent],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly router = inject(Router);

  protected readonly navItems = NAV_ITEMS;
  protected readonly menuOpen = signal(false);

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

  protected onSearch(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const query = input.value.trim();
    void this.router.navigate(['/boutique'], { queryParams: { q: query || null } });
    this.menuOpen.set(false);
  }
}
