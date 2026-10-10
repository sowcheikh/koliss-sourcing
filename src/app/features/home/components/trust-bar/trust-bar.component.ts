import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TRUST_ITEMS } from '../../../../core/config/site.config';

/** Bandeau de réassurance sous le hero. */
@Component({
  selector: 'app-trust-bar',
  template: `
    <section class="border-b border-koliss-border bg-white" aria-label="Nos engagements">
      <ul class="k-container flex list-none flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5">
        @for (item of items; track item.label) {
          <li class="flex items-center gap-2 text-sm font-semibold text-koliss-text-muted">
            <i class="pi text-koliss-primary" [class]="item.icon" aria-hidden="true"></i>
            {{ item.label }}
          </li>
        }
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustBarComponent {
  protected readonly items = TRUST_ITEMS;
}
