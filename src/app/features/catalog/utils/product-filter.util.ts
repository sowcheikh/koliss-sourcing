import { CategoryId } from '../../../shared/models/category.model';
import { Product } from '../../../shared/models/product.model';
import { findCategory } from '../../../core/data/categories.data';
import { getMoq, getStartingPrice } from '../../../shared/utils/pricing.util';

export type SortKey = 'popularity' | 'price-asc' | 'price-desc' | 'moq-asc' | 'newest';

export interface SortOption {
  readonly key: SortKey;
  readonly label: string;
}

export const SORT_OPTIONS: readonly SortOption[] = [
  { key: 'popularity', label: 'Popularité' },
  { key: 'price-asc', label: 'Prix croissant' },
  { key: 'price-desc', label: 'Prix décroissant' },
  { key: 'moq-asc', label: 'MOQ croissant' },
  { key: 'newest', label: 'Nouveautés' },
];

export interface ProductFilters {
  readonly category: CategoryId | 'all';
  readonly query: string;
  /** MOQ maximal accepté. */
  readonly maxMoq: number;
  /** Certifications exigées (le produit doit toutes les posséder). */
  readonly certifications: readonly string[];
  readonly sort: SortKey;
}

export function isSortKey(value: string | null): value is SortKey {
  return SORT_OPTIONS.some((option) => option.key === value);
}

/** Minuscules + suppression des accents pour une recherche tolérante. */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function matchesQuery(product: Product, query: string): boolean {
  const needle = normalizeText(query);
  if (!needle) {
    return true;
  }
  const haystack = normalizeText(
    [
      product.name,
      product.description,
      findCategory(product.category)?.label ?? '',
      product.origin.city,
      ...product.specs.map((spec) => `${spec.label} ${spec.value}`),
    ].join(' '),
  );
  return needle.split(/\s+/).every((word) => haystack.includes(word));
}

export function sortProducts(products: readonly Product[], sort: SortKey): Product[] {
  const sorted = [...products];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => getStartingPrice(a) - getStartingPrice(b));
    case 'price-desc':
      return sorted.sort((a, b) => getStartingPrice(b) - getStartingPrice(a));
    case 'moq-asc':
      return sorted.sort((a, b) => getMoq(a) - getMoq(b));
    case 'newest':
      return sorted.sort((a, b) => b.id - a.id);
    case 'popularity':
    default:
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
  }
}

export function filterProducts(products: readonly Product[], filters: ProductFilters): Product[] {
  const filtered = products.filter(
    (product) =>
      (filters.category === 'all' || product.category === filters.category) &&
      getMoq(product) <= filters.maxMoq &&
      filters.certifications.every((cert) => product.certifications.includes(cert)) &&
      matchesQuery(product, filters.query),
  );
  return sortProducts(filtered, filters.sort);
}
