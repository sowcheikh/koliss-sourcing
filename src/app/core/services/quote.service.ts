import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  QuoteRequest,
  QuoteResponse,
  QuoteSubmissionResult,
} from '../../shared/models/quote.model';

export interface BackendQuoteResponse {
  readonly id: string;
  readonly reference: string;
  readonly status: string;
}

/**
 * Service de gestion et de consultation des demandes de devis de sourcing.
 * Connecté au backend sourcing_service via /sourcing/api/quotes.
 */
@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  /**
   * Récupère la liste des devis pour l'utilisateur connecté (filtré automatiquement par JWT sur /quotes/me).
   */
  getMyQuotes(): Observable<readonly QuoteResponse[]> {
    return this.http.get<readonly QuoteResponse[]>(`${this.baseUrl}/quotes/me`);
  }

  /**
   * Récupère le détail complet d'un devis par sa référence unique (ex: KS-2026-SOLAR01).
   */
  getQuoteByReference(reference: string): Observable<QuoteResponse> {
    return this.http.get<QuoteResponse>(`${this.baseUrl}/quotes/reference/${encodeURIComponent(reference.trim())}`);
  }

  /**
   * Soumet une nouvelle demande de devis au backend.
   */
  submitQuote(request: QuoteRequest): Observable<QuoteSubmissionResult> {
    return this.http.post<BackendQuoteResponse>(`${this.baseUrl}/quotes`, request).pipe(
      map((res) => ({
        success: true,
        reference: res.reference,
        message: 'Votre demande de devis a bien été enregistrée.',
      })),
      catchError((err) => {
        console.error('Erreur lors de la soumission du devis au backend sourcing_service:', err);
        return of({
          success: false,
          reference: '',
          message: 'Une erreur est survenue lors de la transmission de votre demande. Veuillez vérifier votre connexion et réessayer.',
        });
      }),
    );
  }

  /**
   * Le client accepte l'offre chiffrée proposée par KOLISS.
   */
  acceptOffer(quoteId: string): Observable<QuoteResponse> {
    return this.http.post<QuoteResponse>(`${this.baseUrl}/quotes/${quoteId}/accept-offer`, {});
  }

  /**
   * Le client refuse l'offre chiffrée ou demande une révision avec un motif.
   */
  rejectOffer(quoteId: string, reason?: string): Observable<QuoteResponse> {
    return this.http.post<QuoteResponse>(`${this.baseUrl}/quotes/${quoteId}/reject-offer`, { reason });
  }
}
