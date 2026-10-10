import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

const DEFAULT_MESSAGES: Readonly<Record<string, (error: unknown) => string>> = {
  required: () => 'Ce champ est obligatoire.',
  email: () => 'Adresse email invalide.',
  pattern: () => 'Format invalide.',
  min: (error) => `La valeur minimale est ${(error as { min: number }).min}.`,
};

/**
 * Champ de formulaire : libellé, indicateur « obligatoire » et message d'erreur.
 * Le contrôle (`input`, `select`, `textarea` avec la classe `k-input`) est projeté.
 *
 * ```html
 * <app-form-field label="Email" fieldId="d-email" [control]="form.controls.email" required>
 *   <input id="d-email" class="k-input" formControlName="email" />
 * </app-form-field>
 * ```
 */
@Component({
  selector: 'app-form-field',
  template: `
    <div>
      <label class="k-label" [attr.for]="fieldId()">
        {{ label() }}
        @if (required()) {
          <span class="k-required" aria-hidden="true">*</span>
        }
      </label>
      <ng-content />
      @if (errorMessage(); as message) {
        <p class="k-field-error" role="alert">{{ message }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  readonly label = input.required<string>();
  readonly fieldId = input.required<string>();
  readonly control = input<AbstractControl | null>(null);
  readonly required = input(false, { transform: booleanAttribute });
  /** Messages personnalisés par type d'erreur (ex : `{ required: '…' }`). */
  readonly messages = input<Readonly<Record<string, string>>>({});

  private readonly tick = signal(0);

  constructor() {
    // Re-évalue le message à chaque évènement du contrôle (valeur, statut, touched, pristine).
    effect((onCleanup) => {
      const control = this.control();
      if (!control) {
        return;
      }
      const subscription = control.events.subscribe(() => this.tick.update((n) => n + 1));
      onCleanup(() => subscription.unsubscribe());
    });
  }

  protected readonly errorMessage = computed(() => {
    this.tick();
    const control = this.control();
    if (!control || !control.invalid || !(control.touched || control.dirty)) {
      return null;
    }
    return this.firstMessage(control.errors);
  });

  private firstMessage(errors: ValidationErrors | null): string | null {
    if (!errors) {
      return null;
    }
    const [key, value] = Object.entries(errors)[0];
    return this.messages()[key] ?? DEFAULT_MESSAGES[key]?.(value) ?? 'Valeur invalide.';
  }
}
