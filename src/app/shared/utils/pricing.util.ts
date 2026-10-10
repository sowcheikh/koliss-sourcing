import { Product, PriceTier } from '../models/product.model';

/** MOQ (quantité minimale de commande) = borne basse du premier palier. */
export function getMoq(product: Product): number {
  return product.tiers[0]?.minQty ?? 1;
}

/** Prix unitaire « à partir de » = prix du premier palier. */
export function getStartingPrice(product: Product): number {
  return product.tiers[0]?.unitPrice ?? 0;
}

/** Pluriel de l'unité de vente : « unité » devient « unités », les autres restent inchangées. */
export function pluralizeUnit(unit: string, quantity = 2): string {
  return unit === 'unité' && quantity !== 1 ? 'unités' : unit;
}

/** Libellé court d'un palier : « 10–49 », « 500+ » ou « 1 ». */
export function formatTierRange(tier: PriceTier): string {
  if (tier.maxQty === null) {
    return `${tier.minQty}+`;
  }
  return tier.minQty === tier.maxQty ? `${tier.minQty}` : `${tier.minQty}–${tier.maxQty}`;
}

/** Libellé long d'un palier : « 10 à 49 unités », « 500 unités et plus ». */
export function formatTierSentence(tier: PriceTier, unit: string): string {
  const label = pluralizeUnit(unit, tier.maxQty ?? tier.minQty);
  if (tier.maxQty === null) {
    return `${tier.minQty} ${label} et plus`;
  }
  return tier.minQty === tier.maxQty
    ? `${tier.minQty} ${pluralizeUnit(unit, tier.minQty)}`
    : `${tier.minQty} à ${tier.maxQty} ${label}`;
}

/** Palier applicable à une quantité donnée (le premier palier si la quantité est inférieure au MOQ). */
export function findTierForQuantity(tiers: readonly PriceTier[], quantity: number): PriceTier | null {
  if (tiers.length === 0) {
    return null;
  }
  const match = tiers.find(
    (tier) => quantity >= tier.minQty && (tier.maxQty === null || quantity <= tier.maxQty),
  );
  return match ?? (quantity < tiers[0].minQty ? tiers[0] : tiers[tiers.length - 1]);
}

/** Total estimé d'un palier (borne basse × prix) ; `null` pour un palier ouvert (« sur demande »). */
export function estimateTierTotal(tier: PriceTier): number | null {
  return tier.maxQty === null ? null : tier.minQty * tier.unitPrice;
}
