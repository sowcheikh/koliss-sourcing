import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CatalogService } from '../../../../core/services/catalog.service';
import { CategoryId } from '../../../../shared/models/category.model';
import { Product } from '../../../../shared/models/product.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { PageHeroComponent } from '../../../../shared/components/page-hero/page-hero.component';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { CatalogFiltersComponent } from '../../components/catalog-filters/catalog-filters.component';
import {
  CATALOG_MAX_MOQ,
  CATALOG_PAGE_SIZE,
} from '../../data/catalog.data';
import {
  filterProducts,
  isSortKey,
  SORT_OPTIONS,
  SortKey,
} from '../../utils/product-filter.util';

@Component({
  selector: 'app-catalog-page',
  imports: [
    FormsModule,
    ButtonComponent,
    PageHeroComponent,
    ProductCardComponent,
    CatalogFiltersComponent,
  ],
  templateUrl: './catalog-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPageComponent {
  private readonly catalogService = inject(CatalogService);
  private readonly router = inject(Router);

  // Router inputs bound from queryParams (?cat=...&q=...)
  readonly cat = input<string>();
  readonly q = input<string>();

  protected readonly categories = this.catalogService.categories;
  protected readonly allProducts = toSignal(this.catalogService.getProducts(), {
    initialValue: [] as readonly Product[],
  });

  // State
  protected readonly selectedCategory = signal<CategoryId | 'all'>('all');
  protected readonly searchQuery = signal('');
  protected readonly maxMoq = signal(CATALOG_MAX_MOQ);
  protected readonly selectedCertifications = signal<readonly string[]>([]);
  protected readonly sortKey = signal<SortKey>('popularity');
  protected readonly layoutMode = signal<'grid' | 'list'>('grid');
  protected readonly visibleLimit = signal(CATALOG_PAGE_SIZE);

  protected readonly sortOptions = SORT_OPTIONS;

  protected readonly breadcrumb = [
    { label: 'Accueil', link: '/' },
    { label: 'Boutique' },
  ];

  constructor() {
    // Synchronize query parameters when URL inputs change
    effect(() => {
      const catParam = this.cat();
      if (catParam && this.categories.some((c) => c.id === catParam)) {
        this.selectedCategory.set(catParam as CategoryId);
      } else {
        this.selectedCategory.set('all');
      }
    });

    effect(() => {
      const qParam = this.q();
      this.searchQuery.set(qParam ? qParam.trim() : '');
    });
  }

  // Counts per category for the filter sidebar
  protected readonly categoryCounts = computed(() => {
    const products = this.allProducts();
    const counts: Record<string, number> = {};
    for (const cat of this.categories) {
      counts[cat.id] = products.filter((p) => p.category === cat.id).length;
    }
    return counts;
  });

  // Filtered and sorted products
  protected readonly filteredProducts = computed(() => {
    return filterProducts(this.allProducts(), {
      category: this.selectedCategory(),
      query: this.searchQuery(),
      maxMoq: this.maxMoq(),
      certifications: this.selectedCertifications(),
      sort: this.sortKey(),
    });
  });

  // Visible sliced products
  protected readonly displayedProducts = computed(() => {
    return this.filteredProducts().slice(0, this.visibleLimit());
  });

  protected readonly hasMore = computed(() => {
    return this.displayedProducts().length < this.filteredProducts().length;
  });

  // Handlers
  protected onCategoryChange(category: CategoryId | 'all'): void {
    this.selectedCategory.set(category);
    this.visibleLimit.set(CATALOG_PAGE_SIZE);
    void this.router.navigate([], {
      queryParams: { cat: category === 'all' ? null : category },
      queryParamsHandling: 'merge',
    });
  }

  protected onQueryChange(query: string): void {
    this.searchQuery.set(query);
    this.visibleLimit.set(CATALOG_PAGE_SIZE);
    void this.router.navigate([], {
      queryParams: { q: query.trim() || null },
      queryParamsHandling: 'merge',
    });
  }

  protected onMaxMoqChange(moq: number): void {
    this.maxMoq.set(moq);
    this.visibleLimit.set(CATALOG_PAGE_SIZE);
  }

  protected onCertificationToggle(cert: string): void {
    this.selectedCertifications.update((certs) =>
      certs.includes(cert) ? certs.filter((c) => c !== cert) : [...certs, cert],
    );
    this.visibleLimit.set(CATALOG_PAGE_SIZE);
  }

  protected onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (isSortKey(target.value)) {
      this.sortKey.set(target.value);
    }
  }

  protected loadMore(): void {
    this.visibleLimit.update((current) => current + CATALOG_PAGE_SIZE);
  }
}
