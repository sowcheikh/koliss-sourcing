import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface TabItem {
  readonly id: string;
  readonly label: string;
}

/**
 * Onglets segmentés accessibles (ARIA tabs + navigation clavier ← →).
 * Le conteneur affiche les panneaux avec `role="tabpanel"` et
 * `[attr.aria-labelledby]="idPrefix + '-tab-' + id"`.
 */
@Component({
  selector: 'app-tabs',
  template: `
    <div
      role="tablist"
      class="flex gap-1 rounded-xl bg-koliss-bg-2 p-1"
      (keydown)="onKeydown($event)"
    >
      @for (tab of tabs(); track tab.id) {
        <button
          type="button"
          role="tab"
          class="flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200"
          [class]="
            activeId() === tab.id
              ? 'bg-white text-koliss-primary shadow-koliss-card'
              : 'text-koliss-text-muted hover:text-koliss-primary'
          "
          [id]="idPrefix() + '-tab-' + tab.id"
          [attr.aria-selected]="activeId() === tab.id"
          [attr.aria-controls]="idPrefix() + '-panel-' + tab.id"
          [attr.tabindex]="activeId() === tab.id ? 0 : -1"
          (click)="activeId.set(tab.id)"
        >
          {{ tab.label }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  readonly tabs = input.required<readonly TabItem[]>();
  readonly idPrefix = input('tabs');
  readonly activeId = model.required<string>();

  protected onKeydown(event: KeyboardEvent): void {
    const tabs = this.tabs();
    const index = tabs.findIndex((tab) => tab.id === this.activeId());
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (step === 0 || index < 0) {
      return;
    }
    event.preventDefault();
    const next = tabs[(index + step + tabs.length) % tabs.length];
    this.activeId.set(next.id);
    queueMicrotask(() =>
      (document.getElementById(`${this.idPrefix()}-tab-${next.id}`) as HTMLElement | null)?.focus(),
    );
  }
}
