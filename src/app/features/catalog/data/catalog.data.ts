export interface CertificationFilter {
  /** Valeur exacte présente dans `Product.certifications`. */
  readonly value: string;
  readonly label: string;
}

export interface OriginFilter {
  readonly label: string;
  readonly countryCode: string;
  /** `false` : origine annoncée mais pas encore référencée dans le catalogue. */
  readonly available: boolean;
}

/** Nombre de produits affichés par « page » (bouton « Charger plus »). */
export const CATALOG_PAGE_SIZE = 6;

/** Borne haute du filtre MOQ. */
export const CATALOG_MAX_MOQ = 500;

export const CERTIFICATION_FILTERS: readonly CertificationFilter[] = [
  { value: 'CE', label: 'CE Certifié' },
  { value: 'ISO 9001', label: 'ISO 9001' },
  { value: 'SGS', label: 'SGS Vérifié' },
];

export const ORIGIN_FILTERS: readonly OriginFilter[] = [
  { label: 'Chine (Guangzhou, Shenzhen)', countryCode: 'cn', available: true },
  { label: 'Inde', countryCode: 'in', available: false },
  { label: 'Turquie', countryCode: 'tr', available: false },
];
