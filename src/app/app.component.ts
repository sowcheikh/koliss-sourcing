import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastContainerComponent],
  template: `
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-koliss focus:bg-koliss-secondary focus:px-4 focus:py-2 focus:font-semibold"
    >
      Aller au contenu principal
    </a>
    <app-header />
    <main id="main-content" tabindex="-1" class="min-h-[60vh] outline-none">
      <router-outlet />
    </main>
    <app-footer />
    <app-toast-container />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
