import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product } from '../../../../shared/models/product.model';
import { formatPrice } from '../../../../shared/utils/format.util';
import { getMoq, getStartingPrice, pluralizeUnit } from '../../../../shared/utils/pricing.util';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { HERO_STATS } from '../../data/home.data';

/** Hero d'accueil : accroche, CTA, chiffres clés et carte « produit populaire ». */
@Component({
  selector: 'app-hero-section',
  imports: [RouterLink, ButtonComponent],
  template: `
    <section class="relative overflow-hidden bg-koliss-primary text-white">
      <div
        class="pointer-events-none absolute inset-0 opacity-60"
        style="background: radial-gradient(60% 80% at 85% 20%, rgba(255,204,0,.18), transparent 60%), radial-gradient(50% 60% at 0% 100%, rgba(42,74,168,.9), transparent 70%)"
        aria-hidden="true"
      ></div>

      <div class="k-container relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span class="k-tag !mb-6">N°1 Marketplace sourcing gros Afrique</span>
          <h1 class="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
            Approvisionnez votre entreprise
            <span class="text-koliss-secondary">directement</span> à la source
          </h1>
          <p class="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            La première place de marché de sourcing en gros pour TPE, PME et e-commerçants africains.
            Solaire, BTP, Agricole, Médical, Industriel — livraison directe Asie–Afrique en 10 à 15
            jours.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a appButton variant="yellow" size="lg" routerLink="/boutique">
              Explorer la boutique
              <i class="pi pi-arrow-right" aria-hidden="true"></i>
            </a>
            <a appButton variant="ghost" size="lg" routerLink="/devis">
              <i class="pi pi-file-edit" aria-hidden="true"></i>
              Demander un devis
            </a>
          </div>
          <dl class="mt-12 grid grid-cols-2 gap-6 border-t border-white/15 pt-8 sm:grid-cols-4">
            @for (stat of stats; track stat.label) {
              <div>
                <dd class="order-first text-3xl font-extrabold text-koliss-secondary">{{ stat.value }}</dd>
                <dt class="mt-1 text-xs text-white/65">{{ stat.label }}</dt>
              </div>
            }
          </dl>
        </div>

        <!-- Visuel -->
        <div class="relative mx-auto w-full max-w-md lg:max-w-none">
          <div class="relative mx-auto max-w-sm rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <p class="text-xs font-bold uppercase tracking-widest text-white/60">Produit populaire</p>
            @if (featured(); as product) {
              <div class="mt-4 flex items-center gap-4">
                <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-koliss-secondary text-koliss-text">
                  <i class="pi text-2xl" [class]="product.icon" aria-hidden="true"></i>
                </span>
                <div>
                  <p class="font-bold leading-snug">{{ product.name }}</p>
                  <p class="mt-0.5 text-xs text-white/60">MOQ : {{ moq() }} {{ moq() === 1 ? 'unité' : 'unités' }}</p>
                </div>
              </div>
              <p class="mt-5 text-4xl font-extrabold text-koliss-secondary">
                {{ price() }}
                <span class="text-sm font-medium text-white/60">/ {{ unit() }}</span>
              </p>
            }
            <div class="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
              <div class="h-full w-[72%] rounded-full bg-koliss-secondary"></div>
            </div>
            <p class="mt-2 text-xs text-white/60">72% des stocks réservés</p>
          </div>

          <div
            class="absolute -left-2 top-2 hidden rounded-xl bg-white p-3 text-koliss-text shadow-xl animate-fade-in lg:block"
            aria-hidden="true"
          >
            <p class="text-[11px] font-semibold text-koliss-text-soft">Livraison en cours</p>
            <p class="text-sm font-extrabold text-koliss-primary">
              <i class="pi pi-truck mr-1"></i>Dakar
            </p>
            <p class="text-[11px] font-semibold text-koliss-success-dark">✓ Livré en 10 jours</p>
          </div>
          <div
            class="absolute -right-2 bottom-24 hidden rounded-xl bg-white p-3 text-koliss-text shadow-xl animate-fade-in lg:block"
            aria-hidden="true"
          >
            <p class="text-[11px] font-semibold text-koliss-text-soft">Économie réalisée</p>
            <p class="text-xl font-extrabold text-koliss-success-dark">-37%</p>
            <p class="text-[11px] text-koliss-text-soft">vs fournisseur local</p>
          </div>
          <div
            class="absolute -bottom-4 left-4 hidden rounded-xl bg-white p-3 text-koliss-text shadow-xl animate-fade-in lg:block"
            aria-hidden="true"
          >
            <p class="text-[11px] font-semibold text-koliss-text-soft">Commande validée</p>
            <p class="text-sm font-extrabold text-koliss-primary">
              <i class="pi pi-check-circle mr-1 text-koliss-success"></i>200 unités
            </p>
            <p class="text-[11px] text-koliss-text-soft">Paiement sécurisé</p>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSectionComponent {
  /** Produit mis en avant dans la carte « Produit populaire ». */
  readonly featured = input<Product | undefined>();

  protected readonly stats = HERO_STATS;
  protected readonly moq = computed(() => {
    const product = this.featured();
    return product ? getMoq(product) : 0;
  });
  protected readonly price = computed(() => {
    const product = this.featured();
    return product ? formatPrice(getStartingPrice(product)) : '';
  });
  protected readonly unit = computed(() => {
    const product = this.featured();
    return product ? pluralizeUnit(product.unit, 1) : '';
  });
}
