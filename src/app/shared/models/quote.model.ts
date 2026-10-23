export interface QuoteProductItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface QuoteRequest {
  customerId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  country: string;
  destinationCity?: string;
  deliveryMode: string;
  formula?: string;
  categories: readonly string[];
  products: readonly QuoteProductItem[];
  notes?: string;
  budget?: string;
}

export interface QuoteSubmissionResult {
  readonly success: boolean;
  readonly reference: string;
  readonly message: string;
}

export interface QuoteItemResponse {
  readonly id: string;
  readonly productName: string;
  readonly quantity: number;
  readonly unit: string;
  readonly targetPrice?: number | null;
  readonly specifications?: string | null;
  readonly productId?: string | null;
}

export interface QuoteResponse {
  readonly id: string;
  readonly reference: string;
  readonly customerId: string;
  readonly prospect: boolean;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly email?: string | null;
  readonly phone?: string | null;
  readonly company?: string | null;
  readonly position?: string | null;
  readonly destinationCountry: string;
  readonly destinationCity?: string | null;
  readonly deliveryMode: string;
  readonly formula: string;
  readonly estimatedBudget?: string | null;
  readonly notes?: string | null;
  readonly status: string;
  readonly assignedAgentId?: string | null;
  readonly factoryQuoteAmount?: number | null;
  readonly shippingQuoteAmount?: number | null;
  readonly customsQuoteAmount?: number | null;
  readonly kolissFeeAmount?: number | null;
  readonly totalQuotedAmount?: number | null;
  readonly offerValidityDate?: string | null;
  readonly offerNotes?: string | null;
  readonly items: readonly QuoteItemResponse[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly createdBy?: string | null;
  readonly updatedBy?: string | null;
}

export interface QuoteStatusMeta {
  readonly label: string;
  readonly badgeClass: string;
  readonly dotClass: string;
  readonly icon: string;
}

export const QUOTE_STATUS_CONFIG: Record<string, QuoteStatusMeta> = {
  PENDING: {
    label: 'En attente',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-500',
    icon: 'pi-clock',
  },
  IN_REVIEW: {
    label: 'En étude usine',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    dotClass: 'bg-blue-500',
    icon: 'pi-search',
  },
  SUPPLIERS_CONTACTED: {
    label: 'Fournisseurs consultés',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    dotClass: 'bg-indigo-500',
    icon: 'pi-building',
  },
  OFFER_PROPOSED: {
    label: 'Devis chiffré prêt',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-500',
    icon: 'pi-file-check',
  },
  ACCEPTED: {
    label: 'Validé & Commandé',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    dotClass: 'bg-teal-500',
    icon: 'pi-check-circle',
  },
  IN_PRODUCTION: {
    label: 'En fabrication usine',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    dotClass: 'bg-purple-500',
    icon: 'pi-cog',
  },
  QUALITY_CHECK: {
    label: 'Contrôle qualité',
    badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    dotClass: 'bg-cyan-500',
    icon: 'pi-verified',
  },
  SHIPPED: {
    label: 'En transit maritime / aérien',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    dotClass: 'bg-sky-500',
    icon: 'pi-send',
  },
  DELIVERED: {
    label: 'Livré à destination',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-500',
    icon: 'pi-box',
  },
  CANCELLED: {
    label: 'Annulé',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    dotClass: 'bg-rose-500',
    icon: 'pi-times',
  },
};

export const FORMULA_LABELS: Record<string, string> = {
  STARTER: 'Formule Starter',
  PRO_PME: 'Formule Pro PME',
  OEM: 'Formule OEM Marque Propre',
};

export const DELIVERY_LABELS: Record<string, string> = {
  AIR_STANDARD: 'Aérien standard (7–10j)',
  AIR_EXPRESS: 'Aérien express (3–5j)',
  SEA_STANDARD: 'Maritime standard (30–45j)',
  SEA_EXPRESS: 'Maritime express (20–25j)',
  SEA_FCL: 'Maritime FCL (Conteneur complet)',
  SEA_LCL: 'Maritime LCL (Groupage)',
};
