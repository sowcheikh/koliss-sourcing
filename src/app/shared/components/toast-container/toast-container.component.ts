import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NotificationService, ToastKind } from '../../../core/services/notification.service';

const KIND_STYLES: Readonly<Record<ToastKind, { classes: string; icon: string }>> = {
  success: { classes: 'border-koliss-success text-koliss-success-dark', icon: 'pi-check-circle' },
  error: { classes: 'border-koliss-error text-koliss-error-dark', icon: 'pi-times-circle' },
  warning: { classes: 'border-koliss-warning text-koliss-warning-dark', icon: 'pi-exclamation-triangle' },
  info: { classes: 'border-koliss-info text-koliss-info-dark', icon: 'pi-info-circle' },
};

/** Affiche les notifications globales (à placer une seule fois dans le composant racine). */
@Component({
  selector: 'app-toast-container',
  template: `
    <div
      class="pointer-events-none fixed bottom-4 right-4 z-[110] flex w-[min(92vw,380px)] flex-col gap-3"
      role="status"
      aria-live="polite"
    >
      @for (toast of notifications.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 rounded-koliss border-l-4 bg-white p-4 shadow-xl animate-fade-in"
          [class]="styles[toast.kind].classes"
        >
          <i class="pi mt-0.5 text-lg" [class]="styles[toast.kind].icon" aria-hidden="true"></i>
          <p class="flex-1 text-sm font-semibold text-koliss-text">{{ toast.message }}</p>
          <button
            type="button"
            class="text-koliss-text-soft transition-colors hover:text-koliss-text"
            aria-label="Fermer la notification"
            (click)="notifications.dismiss(toast.id)"
          >
            <i class="pi pi-times text-xs" aria-hidden="true"></i>
          </button>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  protected readonly notifications = inject(NotificationService);
  protected readonly styles = KIND_STYLES;
}
