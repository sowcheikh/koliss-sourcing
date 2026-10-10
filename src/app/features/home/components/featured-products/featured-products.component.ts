import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product } from '../../../../shared/models/product.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { SectionHeadingComponent } from '../../../../shared/components/section-heading/section-heading.component';

/** Produits phares : 4 produits les plus commandés. */
@Component({
  selector: 'app-featured-products',
  imports: [RouterLink, ButtonComponent, ProductCardComponent, SectionHeadingComponent],
  template: `
    <section class="k-section">
      <div class="k-container">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <app-section-heading tag="Produits phares">
            Les plus commandés<br />ce <em>mois-ci</em>
          </app-section-heading>
          <a appButton variant="outline-navy" routerLink="/boutique">
            Voir tous les produits
            <i class="pi pi-arrow-right text-sm" aria-hidden="true"></i>
          </a>
        </div>
        <div class="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          @for (product of products(); track product.id) {
            <app-product-card [product]="product" />
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedProductsComponent {
  readonly products = input.required<readonly Product[]>();
}
