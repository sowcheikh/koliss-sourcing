import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { CONTACT, SITE_NAME, WHATSAPP_URL } from '../../../../core/config/site.config';
import { findCategory } from '../../../../core/data/categories.data';
import { CatalogService } from '../../../../core/services/catalog.service';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { QuantityStepperComponent } from '../../../../shared/components/quantity-stepper/quantity-stepper.component';
import { RatingComponent } from '../../../../shared/components/rating/rating.component';
import { TabItem, TabsComponent } from '../../../../shared/components/tabs/tabs.component';
import { PriceTier, Product } from '../../../../shared/models/product.model';
import { formatNumber, formatPrice } from '../../../../shared/utils/format.util';
import {
  estimateTierTotal,
  findTierForQuantity,
  formatTierRange,
  formatTierSentence,
  getMoq,
  pluralizeUnit,
} from '../../../../shared/utils/pricing.util';
import { TONE_CLASSES } from '../../../../shared/utils/tone.util';

const TABS: readonly TabItem[] = [
  { id: 'specs', label: 'Spécifications' },
  { id: 'desc', label: 'Description' },
  { id: 'livraison', label: 'Livraison & Logistique' },
];

@Component({
  selector: 'app-product-page',
  imports: [
    RouterLink,
    BreadcrumbComponent,
    ButtonComponent,
    RatingComponent,
    QuantityStepperComponent,
    TabsComponent,
    ProductCardComponent,
  ],
  templateUrl: './product-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPageComponent {
  /** Paramètre de route `:id` injecté par Angular router (`withComponentInputBinding`). */
  readonly id = input.required<string>();

  private readonly catalogService = inject(CatalogService);
  private readonly titleService = inject(Title);

  protected readonly tabs = TABS;
  protected readonly activeTab = signal('specs');
  protected readonly activeVisual = signal<string | null>(null);
  protected readonly quantity = signal(1);
  protected readonly manualTier = signal<PriceTier | null>(null);

  protected readonly product = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.catalogService.getProductById(id))),
    { initialValue: undefined },
  );

  protected readonly category = computed(() => {
    const p = this.product();
    return p ? findCategory(p.category) : undefined;
  });

  protected readonly toneClass = computed(() => {
    const cat = this.category();
    return TONE_CLASSES[cat?.tone ?? 'slate'];
  });

  protected readonly moq = computed(() => {
    const p = this.product();
    return p ? getMoq(p) : 1;
  });

  protected readonly currentVisual = computed(() => {
    const selected = this.activeVisual();
    if (selected) {
      return selected;
    }
    return this.product()?.icon ?? 'pi-box';
  });

  /** Palier actif : soit sélectionné manuellement au clic sur la table, soit calculé selon la quantité. */
  protected readonly activeTier = computed(() => {
    const p = this.product();
    if (!p) {
      return null;
    }
    const manual = this.manualTier();
    if (manual) {
      return manual;
    }
    return findTierForQuantity(p.tiers, this.quantity());
  });

  protected readonly currentUnitPrice = computed(() => {
    const tier = this.activeTier();
    return tier?.unitPrice ?? 0;
  });

  protected readonly estimatedTotal = computed(() => {
    const qty = this.quantity();
    const unitPrice = this.currentUnitPrice();
    return qty * unitPrice;
  });

  protected readonly activeTierSentence = computed(() => {
    const tier = this.activeTier();
    const p = this.product();
    if (!tier || !p) {
      return '';
    }
    return formatTierSentence(tier, p.unit);
  });

  protected readonly breadcrumbs = computed<readonly BreadcrumbItem[]>(() => {
    const p = this.product();
    const cat = this.category();
    if (!p) {
      return [
        { label: 'Accueil', link: '/' },
        { label: 'Boutique', link: '/boutique' },
        { label: 'Produit introuvable' },
      ];
    }
    return [
      { label: 'Accueil', link: '/' },
      { label: 'Boutique', link: '/boutique' },
      ...(cat ? [{ label: cat.label, link: ['/boutique'], queryParams: { cat: cat.id } } as BreadcrumbItem] : []),
      { label: p.name },
    ];
  });

  protected readonly allProducts = toSignal(this.catalogService.getProducts(), {
    initialValue: [] as readonly Product[],
  });

  /** Produits suggérés de la même catégorie. */
  protected readonly relatedProducts = computed(() => {
    const current = this.product();
    if (!current) {
      return [];
    }
    return this.allProducts()
      .filter((p) => p.category === current.category && p.id !== current.id)
      .slice(0, 3);
  });

  protected readonly whatsappDirectUrl = computed(() => {
    const p = this.product();
    const text = encodeURIComponent(
      `Bonjour KOLISS Sourcing, je souhaite des informations et un devis pour le produit : ${p?.name ?? ''} (Réf #${p?.id ?? ''})`,
    );
    return `${WHATSAPP_URL}?text=${text}`;
  });

  protected readonly contact = CONTACT;

  constructor() {
    // Synchronise la quantité initiale avec le MOQ du produit.
    effect(() => {
      const p = this.product();
      if (p) {
        this.titleService.setTitle(`${p.name} — ${SITE_NAME}`);
        this.quantity.set(getMoq(p));
        this.activeVisual.set(null);
        this.manualTier.set(null);
      }
    });
  }

  protected selectTier(tier: PriceTier): void {
    this.manualTier.set(tier);
    // Si la quantité actuelle est en dehors du palier cliqué, l'aligner sur la borne minimale
    if (this.quantity() < tier.minQty) {
      this.quantity.set(tier.minQty);
    } else if (tier.maxQty !== null && this.quantity() > tier.maxQty) {
      this.quantity.set(tier.minQty);
    }
  }

  protected selectVisual(icon: string): void {
    this.activeVisual.set(icon);
  }

  protected onQuantityChange(newQty: number): void {
    this.quantity.set(newQty);
    this.manualTier.set(null);
  }

  protected formatPrice(val: number): string {
    return formatPrice(val);
  }

  protected formatNumber(val: number): string {
    return formatNumber(val);
  }

  protected formatTierRange(tier: PriceTier): string {
    return formatTierRange(tier);
  }

  protected estimateTierTotal(tier: PriceTier): number | null {
    return estimateTierTotal(tier);
  }

  protected pluralizeUnit(unit: string, qte: number): string {
    return pluralizeUnit(unit, qte);
  }
}
