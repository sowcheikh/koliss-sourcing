import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IconTileComponent, IconTone } from '../icon-tile/icon-tile.component';

/** Ligne « icône + titre + description » (avantages, garanties, modes de livraison). */
@Component({
  selector: 'app-feature-item',
  imports: [IconTileComponent],
  template: `
    <div class="flex items-start gap-4">
      <app-icon-tile [icon]="icon()" [tone]="tone()" [size]="size()" />
      <div>
        <h3 class="text-base font-bold" [class]="dark() ? 'text-white' : 'text-koliss-text'">
          {{ title() }}
        </h3>
        <p
          class="mt-1 text-sm leading-relaxed"
          [class]="dark() ? 'text-white/65' : 'text-koliss-text-muted'"
        >
          {{ description() }}
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureItemComponent {
  readonly icon = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly tone = input<IconTone>('slate');
  readonly size = input(44);
  readonly dark = input(false);
}
