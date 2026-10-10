import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * En-tête de section : pastille (tag), titre et sous-titre.
 * Le titre est projeté pour permettre `<br>` et `<em>` (mise en avant jaune).
 */
@Component({
  selector: 'app-section-heading',
  template: `
    <div [class.text-center]="align() === 'center'" [class.k-on-dark]="dark()">
      @if (tag()) {
        <span class="k-tag">{{ tag() }}</span>
      }
      <h2 class="k-section-title"><ng-content /></h2>
      @if (subtitle()) {
        <p
          class="k-section-sub"
          [class.mx-auto]="align() === 'center'"
          [style.color]="dark() ? 'var(--k-on-navy-muted)' : null"
        >
          {{ subtitle() }}
        </p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeadingComponent {
  readonly tag = input<string>();
  readonly subtitle = input<string>();
  readonly align = input<'left' | 'center'>('left');
  readonly dark = input(false);
}
