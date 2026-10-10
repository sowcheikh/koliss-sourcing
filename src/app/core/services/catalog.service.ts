import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CATEGORIES } from '../data/categories.data';
import { PRODUCTS_MOCK } from '../data/products.mock';
import { Category } from '../../shared/models/category.model';
import { Product } from '../../shared/models/product.model';

/**
 * Point d'accès unique au catalogue.
 *
 * ⚠️ Aucune API catalogue n'est disponible pour l'instant : les produits proviennent de
 * `PRODUCTS_MOCK` (données de démonstration). Les méthodes retournent déjà des `Observable`
 * afin de pouvoir être branchées sur `HttpClient` sans modifier les composants.
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  readonly categories: readonly Category[] = CATEGORIES;

  getProducts(): Observable<readonly Product[]> {
    // TODO(API) : remplacer par `this.http.get<Product[]>('/api/sourcing/products')`.
    return of(PRODUCTS_MOCK);
  }

  getProductById(id: number): Observable<Product | undefined> {
    // TODO(API) : remplacer par `this.http.get<Product>(`/api/sourcing/products/${id}`)`.
    return of(PRODUCTS_MOCK.find((product) => product.id === id));
  }
}
