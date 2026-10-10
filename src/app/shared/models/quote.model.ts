export interface QuoteProductItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface QuoteRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  country: string;
  deliveryMode: string;
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
