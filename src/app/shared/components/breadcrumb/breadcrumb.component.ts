import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  readonly label: string;
  /** Absent pour la page courante. */
  readonly link?: string | readonly string[];
  readonly queryParams?: Record<string, string | number>;
}

/** Fil d'Ariane accessible. `dark` : variante sur fond bleu KOLISS. */
@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  template: `
    <nav aria-label="Fil d'Ariane">
      <ol
        class="flex flex-wrap items-center gap-2 text-sm"
        [class]="dark() ? 'text-white/70' : 'text-koliss-text-soft'"
      >
        @for (item of items(); track $index; let last = $last) {
          <li class="flex items-center gap-2">
            @if (item.link && !last) {
              <a
                [routerLink]="item.link"
                [queryParams]="item.queryParams"
                class="transition-colors hover:text-koliss-secondary focus-visible:underline"
                >{{ item.label }}</a
              >
            } @else {
              <span
                [attr.aria-current]="last ? 'page' : null"
                class="font-semibold"
                [class]="dark() ? 'text-koliss-secondary' : 'text-koliss-primary'"
                >{{ item.label }}</span
              >
            }
            @if (!last) {
              <i class="pi pi-chevron-right text-[10px]" aria-hidden="true"></i>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  readonly items = input.required<readonly BreadcrumbItem[]>();
  readonly dark = input(true);
}
