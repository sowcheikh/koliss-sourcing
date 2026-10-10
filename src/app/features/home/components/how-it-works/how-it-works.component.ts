import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IconTileComponent } from '../../../../shared/components/icon-tile/icon-tile.component';
import { SectionHeadingComponent } from '../../../../shared/components/section-heading/section-heading.component';
import { HOME_STEPS } from '../../data/home.data';

/** « Comment ça marche » : 4 étapes de la commande à la livraison. */
@Component({
  selector: 'app-how-it-works',
  imports: [IconTileComponent, SectionHeadingComponent],
  template: `
    <section class="k-section !bg-koliss-bg-2">
      <div class="k-container">
        <app-section-heading align="center" tag="Comment ça marche">
          De la commande à la <em>livraison</em><br />en 4 étapes simples
        </app-section-heading>
        <ol class="mt-12 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-4">
          @for (step of steps; track step.title; let index = $index; let last = $last) {
            <li class="k-card relative p-6">
              <span class="absolute right-5 top-4 text-3xl font-extrabold text-koliss-border-strong">
                {{ '0' + (index + 1) }}
              </span>
              <app-icon-tile [icon]="step.icon" tone="navy" [size]="52" />
              <h3 class="mt-5 text-lg font-bold text-koliss-text">{{ step.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-koliss-text-muted">{{ step.description }}</p>
              @if (!last) {
                <i
                  class="pi pi-arrow-right absolute -right-4 top-1/2 z-10 hidden h-8 w-8 items-center justify-center rounded-full bg-koliss-secondary text-xs text-koliss-text lg:flex"
                  aria-hidden="true"
                ></i>
              }
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksComponent {
  protected readonly steps = HOME_STEPS;
}
