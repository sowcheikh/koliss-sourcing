import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

/** Sélecteur de quantité (− / saisie / +) avec borne minimale (MOQ). */
@Component({
  selector: 'app-quantity-stepper',
  template: `
    <div class="inline-flex items-center overflow-hidden rounded-koliss border border-koliss-border-strong bg-white">
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center text-lg font-bold text-koliss-primary transition-colors hover:bg-koliss-secondary-soft disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Diminuer la quantité"
        [disabled]="value() <= min()"
        (click)="change(-1)"
      >
        <i class="pi pi-minus text-xs" aria-hidden="true"></i>
      </button>
      <input
        type="number"
        class="h-11 w-20 border-x border-koliss-border-strong text-center text-base font-bold text-koliss-text outline-none focus-visible:bg-koliss-secondary-soft [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        [min]="min()"
        [value]="value()"
        [attr.aria-label]="'Quantité (minimum ' + min() + ')'"
        (input)="onInput($event)"
        (blur)="clamp()"
      />
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center text-lg font-bold text-koliss-primary transition-colors hover:bg-koliss-secondary-soft"
        aria-label="Augmenter la quantité"
        (click)="change(1)"
      >
        <i class="pi pi-plus text-xs" aria-hidden="true"></i>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantityStepperComponent {
  readonly value = model(1);
  readonly min = input(1);

  protected readonly safeMin = computed(() => Math.max(1, this.min()));

  protected change(delta: number): void {
    this.value.set(Math.max(this.safeMin(), this.value() + delta));
  }

  protected onInput(event: Event): void {
    const parsed = parseInt((event.target as HTMLInputElement).value, 10);
    if (!Number.isNaN(parsed) && parsed >= this.safeMin()) {
      this.value.set(parsed);
    }
  }

  /** Au blur, remet le champ à une valeur valide (≥ MOQ). */
  protected clamp(): void {
    this.value.set(Math.max(this.safeMin(), this.value()));
  }
}
