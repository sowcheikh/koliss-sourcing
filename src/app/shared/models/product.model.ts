import { CategoryId } from './category.model';

/** Palier de prix dégressif. `maxQty: null` = palier ouvert (ex : « 500+ »). */
export interface PriceTier {
  readonly minQty: number;
  readonly maxQty: number | null;
  readonly unitPrice: number;
  /** Palier mis en avant « MEILLEUR PRIX ». */
  readonly bestPrice?: boolean;
}

export interface ProductSpec {
  readonly label: string;
  readonly value: string;
}

export interface ProductOrigin {
  readonly city: string;
  readonly country: string;
  /** Code ISO 3166-1 alpha-2 minuscule (drapeau : assets/flags/{code}.png). */
  readonly countryCode: string;
}

export interface Product {
  readonly id: number;
  readonly category: CategoryId;
  readonly name: string;
  /** Classe PrimeIcons du visuel principal. */
  readonly icon: string;
  /** Classes PrimeIcons des vignettes de la galerie (la première = visuel principal). */
  readonly gallery: readonly string[];
  /** Unité de vente (« unité », « sac 50kg »…). */
  readonly unit: string;
  /** Badge de conformité affiché sur la fiche (ex : « CE + IEC »). */
  readonly badge: string;
  /** Réduction promotionnelle affichée (ex : « -18% »). */
  readonly promo?: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly origin: ProductOrigin;
  readonly productionLeadTime: string;
  readonly description: string;
  readonly specs: readonly ProductSpec[];
  readonly certifications: readonly string[];
  /** Paliers triés par quantité croissante. Le premier palier définit le MOQ. */
  readonly tiers: readonly PriceTier[];
}
