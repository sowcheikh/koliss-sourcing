export interface InvoiceItemResponse {
  readonly id: string;
  readonly description: string;
  readonly quantity: number;
  readonly unit: string;
  readonly unitPriceUsd: number;
  readonly unitPriceCfa: number;
  readonly totalPriceUsd: number;
  readonly totalPriceCfa: number;
}

export interface InvoiceResponse {
  readonly id: string;
  readonly invoiceNumber: string;
  readonly quoteId?: string | null;
  readonly quoteReference?: string | null;
  readonly customerId: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly email?: string | null;
  readonly phone?: string | null;
  readonly company?: string | null;
  readonly invoiceType: 'PROFORMA' | 'DEPOSIT' | 'BALANCE' | 'FINAL';
  readonly status: 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED';
  readonly issueDate: string;
  readonly dueDate?: string | null;
  readonly currency: string;
  readonly exchangeRateUsdCfa: number;
  readonly subtotalUsd: number;
  readonly subtotalCfa: number;
  readonly shippingUsd?: number | null;
  readonly shippingCfa?: number | null;
  readonly customsUsd?: number | null;
  readonly customsCfa?: number | null;
  readonly taxUsd?: number | null;
  readonly taxCfa?: number | null;
  readonly totalUsd: number;
  readonly totalCfa: number;
  readonly paidUsd?: number | null;
  readonly paidCfa?: number | null;
  readonly remainingUsd: number;
  readonly remainingCfa: number;
  readonly depositPercentage?: number | null;
  readonly paymentMethod?: string | null;
  readonly paymentReference?: string | null;
  readonly paymentDate?: string | null;
  readonly notes?: string | null;
  readonly items: readonly InvoiceItemResponse[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface InvoiceStatusMeta {
  readonly label: string;
  readonly badgeClass: string;
  readonly dotClass: string;
  readonly icon: string;
}

export const INVOICE_STATUS_CONFIG: Record<string, InvoiceStatusMeta> = {
  DRAFT: {
    label: 'Brouillon',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
    icon: 'pi-file',
  },
  ISSUED: {
    label: 'À régler',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-500',
    icon: 'pi-clock',
  },
  PARTIALLY_PAID: {
    label: 'Acompte versé',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    dotClass: 'bg-blue-500',
    icon: 'pi-percentage',
  },
  PAID: {
    label: 'Réglée intégralement',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-500',
    icon: 'pi-check-circle',
  },
  CANCELLED: {
    label: 'Annulée',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    dotClass: 'bg-rose-500',
    icon: 'pi-times',
  },
};

export const INVOICE_TYPE_LABELS: Record<string, string> = {
  PROFORMA: 'Facture Proforma',
  DEPOSIT: 'Facture d’Acompte Usine',
  BALANCE: 'Facture de Solde Transit',
  FINAL: 'Facture Définitive',
};
