import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Note moyenne en étoiles (jaune KOLISS) avec libellé accessible. */
@Component({
  selector: 'app-rating',
  template: `
    <span class="inline-flex items-center gap-2" [attr.aria-label]="ariaLabel()">
      <span class="inline-flex gap-0.5 text-koliss-secondary" aria-hidden="true">
        @for (filled of stars(); track $index) {
          <i class="pi" [class]="filled ? 'pi-star-fill' : 'pi-star text-koliss-border-strong'"></i>
        }
      </span>
      @if (showLabel()) {
        <span class="text-sm text-koliss-text-muted">
          <strong class="text-koliss-text">{{ value() }}/5</strong>
          @if (count() !== null) {
            · {{ count() }} avis clients
          }
        </span>
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent {
  readonly value = input.required<number>();
  readonly count = input<number | null>(null);
  readonly showLabel = input(true);

  protected readonly stars = computed(() =>
    Array.from({ length: 5 }, (_, index) => index < Math.round(this.value())),
  );
  protected readonly ariaLabel = computed(
    () => `Note ${this.value()} sur 5${this.count() !== null ? `, ${this.count()} avis` : ''}`,
  );
}
