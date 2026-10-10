import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';

export type ButtonVariant = 'yellow' | 'navy' | 'white' | 'outline' | 'outline-navy' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Bouton KOLISS (design system `k-btn`). S'applique à un `<button>` ou à un `<a>` :
 *
 * ```html
 * <button appButton variant="navy" [loading]="saving()">Envoyer</button>
 * <a appButton routerLink="/devis">Devis gratuit</a>
 * ```
 */
@Component({
  selector: 'button[appButton], a[appButton]',
  template: `
    @if (loading()) {
      <span class="k-spinner" aria-hidden="true"></span>
    }
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.disabled]': 'disabled() || loading() ? "" : null',
  },
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('yellow');
  readonly size = input<ButtonSize>('md');
  readonly block = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() => {
    const classes = ['k-btn', `k-btn--${this.variant()}`];
    if (this.size() === 'sm') classes.push('k-btn--sm');
    if (this.size() === 'lg') classes.push('k-btn--lg');
    if (this.block()) classes.push('k-btn--block');
    return classes.join(' ');
  });
}
