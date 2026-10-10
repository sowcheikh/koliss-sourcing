import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CategoryId, Category } from '../../../../shared/models/category.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {
  CATALOG_MAX_MOQ,
  CERTIFICATION_FILTERS,
  ORIGIN_FILTERS,
} from '../../data/catalog.data';

/** Barre latérale de filtres de la boutique (composant de présentation). */
@Component({
  selector: 'app-catalog-filters',
  imports: [RouterLink, ButtonComponent],
  templateUrl: './catalog-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogFiltersComponent {
  readonly categories = input.required<readonly Category[]>();
  readonly categoryCounts = input.required<Readonly<Record<string, number>>>();
  readonly totalCount = input.required<number>();
  readonly category = input<CategoryId | 'all'>('all');
  readonly query = input('');
  readonly maxMoq = input(CATALOG_MAX_MOQ);
  readonly certifications = input<readonly string[]>([]);

  readonly categoryChange = output<CategoryId | 'all'>();
  readonly queryChange = output<string>();
  readonly maxMoqChange = output<number>();
  readonly certificationToggle = output<string>();

  protected readonly maxMoqBound = CATALOG_MAX_MOQ;
  protected readonly certificationFilters = CERTIFICATION_FILTERS;
  protected readonly originFilters = ORIGIN_FILTERS;

  protected onMoq(event: Event): void {
    this.maxMoqChange.emit(Number((event.target as HTMLInputElement).value));
  }

  protected onQuery(event: Event): void {
    this.queryChange.emit((event.target as HTMLInputElement).value);
  }
}
