import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { CATEGORIES } from '../data/categories.data';
import { Category, CategoryId } from '../../shared/models/category.model';
import { PriceTier, Product } from '../../shared/models/product.model';
import { environment } from '../../../environments/environment';

/**
 * Point d'accès unique au catalogue.
 * Connecté au backend sourcing_service via /sourcing/api/products et /sourcing/api/categories.
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  readonly categories: readonly Category[] = CATEGORIES;

  getProducts(): Observable<readonly Product[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products`).pipe(
      map((items) => (items ?? []).map((item) => this.mapProduct(item))),
      catchError((err) => {
        console.error('Erreur lors du chargement des produits depuis l API Sourcing:', err);
        return of([] as readonly Product[]);
      }),
    );
  }

  getProductById(id: number | string): Observable<Product | undefined> {
    return this.http.get<any>(`${this.baseUrl}/products/${id}`).pipe(
      map((item) => (item ? this.mapProduct(item) : undefined)),
      catchError((err) => {
        console.error(`Erreur lors du chargement du produit #${id} depuis l API:`, err);
        return of(undefined);
      }),
    );
  }

  private mapProduct(raw: any): Product {
    const rawTiers = Array.isArray(raw.tiers) ? raw.tiers : [];
    const mappedTiers: PriceTier[] = rawTiers.map((t: any) => ({
      minQty: t.minQty ?? 1,
      maxQty: t.maxQty ?? null,
      unitPrice: t.unitPrice ?? t.unitPriceCfa ?? (t.unitPriceUsd ? Math.round(t.unitPriceUsd * 600) : 0),
      unitPriceUsd: t.unitPriceUsd,
      unitPriceCfa: t.unitPriceCfa,
      bestPrice: !!t.bestPrice,
    }));

    return {
      id: raw.id,
      category: (raw.category ?? raw.categoryId) as CategoryId,
      name: raw.name ?? '',
      icon: raw.icon ?? 'pi-box',
      gallery: Array.isArray(raw.gallery) && raw.gallery.length > 0 ? raw.gallery : [raw.icon ?? 'pi-box'],
      unit: raw.unit ?? 'unité',
      badge: raw.badge ?? '',
      promo: raw.promo,
      rating: Number(raw.rating ?? 5.0),
      reviewCount: Number(raw.reviewCount ?? 0),
      origin: raw.origin ?? { country: 'Chine', city: 'Shenzhen', countryCode: 'cn' },
      productionLeadTime: raw.productionLeadTime ?? '15–20 jours',
      description: raw.description ?? '',
      specs: Array.isArray(raw.specs) ? raw.specs : [],
      certifications: Array.isArray(raw.certifications) ? raw.certifications : (raw.badge ? [raw.badge] : []),
      tiers: mappedTiers,
    };
  }
}
