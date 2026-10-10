import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SITE_STATS } from '../../../../core/config/site.config';

/** Bandeau de chiffres clés. */
@Component({
  selector: 'app-stats-banner',
  template: `
    <section class="bg-koliss-secondary" aria-label="Chiffres clés">
      <dl class="k-container grid grid-cols-2 gap-8 py-12 text-center md:grid-cols-4">
        @for (stat of stats; track stat.label) {
          <div>
            <dd class="order-first text-4xl font-extrabold text-koliss-primary md:text-5xl">{{ stat.value }}</dd>
            <dt class="mt-1 text-sm font-semibold text-koliss-text">{{ stat.label }}</dt>
          </div>
        }
      </dl>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsBannerComponent {
  protected readonly stats = SITE_STATS;
}
