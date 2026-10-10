import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  readonly id: number;
  readonly kind: ToastKind;
  readonly message: string;
}

const DEFAULT_DURATION_MS = 5000;

/** Notifications globales (toasts) affichées par `ToastContainerComponent`. */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 1;
  private readonly _toasts = signal<readonly Toast[]>([]);

  readonly toasts = this._toasts.asReadonly();

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  warning(message: string): void {
    this.show('warning', message);
  }

  info(message: string): void {
    this.show('info', message);
  }

  dismiss(id: number): void {
    this._toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private show(kind: ToastKind, message: string, durationMs = DEFAULT_DURATION_MS): void {
    const id = this.nextId++;
    this._toasts.update((toasts) => [...toasts, { id, kind, message }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }
}
