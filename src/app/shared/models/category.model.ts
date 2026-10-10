/** Identifiants des catégories de produits du catalogue KOLISS Sourcing. */
export type CategoryId =
  | 'solaire'
  | 'machines'
  | 'agricole'
  | 'btp'
  | 'medical'
  | 'chimique'
  | 'eau'
  | 'alim'
  | 'engins';

/** Teinte de fond douce utilisée pour les visuels d'une catégorie. */
export type CategoryTone = 'sun' | 'green' | 'blue' | 'orange' | 'violet' | 'slate';

export interface Category {
  readonly id: CategoryId;
  /** Libellé complet (filtres, formulaire de devis). */
  readonly label: string;
  /** Libellé court (cartes produit, fil d'ariane). */
  readonly shortLabel: string;
  /** Classe PrimeIcons (ex : `pi-sun`). */
  readonly icon: string;
  readonly tone: CategoryTone;
  /** Description des produits couverts (page Solutions › Secteurs). */
  readonly description?: string;
}
