import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { CatalogService } from '../../../../core/services/catalog.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CtaBannerComponent } from '../../../../shared/components/cta-banner/cta-banner.component';
import { CategoryStripComponent } from '../../components/category-strip/category-strip.component';
import { FeaturedProductsComponent } from '../../components/featured-products/featured-products.component';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { HowItWorksComponent } from '../../components/how-it-works/how-it-works.component';
import { StatsBannerComponent } from '../../components/stats-banner/stats-banner.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { TrustBarComponent } from '../../components/trust-bar/trust-bar.component';
import { WhyKolissComponent } from '../../components/why-koliss/why-koliss.component';

/** Page d'accueil — assemble les sections ; aucune logique d'affichage propre. */
@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    ButtonComponent,
    CtaBannerComponent,
    HeroSectionComponent,
    TrustBarComponent,
    CategoryStripComponent,
    FeaturedProductsComponent,
    HowItWorksComponent,
    StatsBannerComponent,
    WhyKolissComponent,
    TestimonialsComponent,
  ],
  template: `
    <app-hero-section [featured]="products()[0]" />
    <app-trust-bar />
    <app-category-strip />
    <app-featured-products [products]="products().slice(0, 4)" />
    <app-how-it-works />
    <app-stats-banner />
    <app-why-koliss />
    <app-testimonials />
    <app-cta-banner
      text="Rejoignez les entreprises d'Afrique de l'Ouest qui font confiance à KOLISS pour leur approvisionnement."
    >
      <ng-container appCtaTitle>Prêt à sourcer vos produits<br />et économiser jusqu'à <em>40%</em> ?</ng-container>
      <ng-container appCtaActions>
        <a appButton variant="white" size="lg" routerLink="/devis">
          <i class="pi pi-file-edit" aria-hidden="true"></i>
          Demander un devis gratuit
        </a>
        <a appButton variant="ghost" size="lg" routerLink="/boutique">
          Explorer la boutique
          <i class="pi pi-arrow-right" aria-hidden="true"></i>
        </a>
      </ng-container>
    </app-cta-banner>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  protected readonly products = toSignal(inject(CatalogService).getProducts(), { initialValue: [] });
}
