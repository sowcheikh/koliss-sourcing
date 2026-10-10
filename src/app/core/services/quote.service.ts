import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { QuoteRequest, QuoteSubmissionResult } from '../../shared/models/quote.model';

/**
 * Service de soumission de demande de devis.
 *
 * ⚠️ Aucune API devis n'est connectée pour le moment.
 * Le service isole la logique et retourne un `Observable` simulant l'envoi
 * pour permettre un branchement direct sur `HttpClient` ultérieurement.
 */
@Injectable({ providedIn: 'root' })
export class QuoteService {
  submitQuote(request: QuoteRequest): Observable<QuoteSubmissionResult> {
    // TODO(API): Brancher sur `this.http.post<QuoteSubmissionResult>('/api/sourcing/quotes', request)`
    const ref = `DEV-${Math.floor(100000 + Math.random() * 900000)}`;
    return of({
      success: true,
      reference: ref,
      message: 'Votre demande a bien été enregistrée.',
    }).pipe(delay(400));
  }
}
