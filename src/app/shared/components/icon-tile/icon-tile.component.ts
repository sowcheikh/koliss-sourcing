import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { CategoryTone } from '../../models/category.model';
import { TONE_CLASSES } from '../../utils/tone.util';

export type IconTone = CategoryTone | 'navy' | 'yellow' | 'glass';

const EXTRA_TONES: Readonly<Record<'navy' | 'yellow' | 'glass', string>> = {
  navy: 'bg-koliss-primary text-white',
  yellow: 'bg-koliss-secondary text-koliss-text',
  glass: 'bg-white/10 text-koliss-secondary',
};

/** Pastille carrée contenant une icône PrimeIcons. */
@Component({
  selector: 'app-icon-tile',
  template: `
    <span
      class="inline-flex shrink-0 items-center justify-center rounded-koliss"
      [class]="toneClasses()"
      [style.width.px]="size()"
      [style.height.px]="size()"
      aria-hidden="true"
    >
      <i class="pi" [class]="icon()" [style.font-size.px]="size() * 0.46"></i>
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconTileComponent {
  readonly icon = input.required<string>();
  readonly tone = input<IconTone>('slate');
  readonly size = input(44);

  protected readonly toneClasses = computed(() => {
    const tone = this.tone();
    return tone === 'navy' || tone === 'yellow' || tone === 'glass'
      ? EXTRA_TONES[tone]
      : TONE_CLASSES[tone];
  });
}
