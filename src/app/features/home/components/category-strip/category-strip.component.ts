import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CATEGORIES } from '../../../../core/data/categories.data';

/** Bande horizontale de catégories (liens vers la boutique filtrée). */
@Component({
  selector: 'app-category-strip',
  imports: [RouterLink],
  template: `
    <nav class="border-b border-koliss-border bg-koliss-bg" aria-label="Catégories de produits">
      <ul class="k-container flex list-none gap-2.5 overflow-x-auto py-4">
        <li>
          <a class="k-chip is-active" routerLink="/boutique">
            <i class="pi pi-th-large" aria-hidden="true"></i>Tous
          </a>
        </li>
        @for (category of categories; track category.id) {
          <li>
            <a class="k-chip" routerLink="/boutique" [queryParams]="{ cat: category.id }">
              <i class="pi" [class]="category.icon" aria-hidden="true"></i>{{ category.label }}
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryStripComponent {
  protected readonly categories = CATEGORIES;
}
