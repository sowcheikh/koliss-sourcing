import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { InvoiceResponse } from '../../shared/models/invoice.model';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  /**
   * Récupère la liste des factures pour l'utilisateur connecté via /sourcing/api/invoices/me.
   */
  getMyInvoices(): Observable<readonly InvoiceResponse[]> {
    return this.http.get<readonly InvoiceResponse[]>(`${this.baseUrl}/invoices/me`).pipe(
      catchError((err) => {
        console.error('Erreur lors de la récupération des factures sourcing:', err);
        return of([] as readonly InvoiceResponse[]);
      }),
    );
  }

  /**
   * Récupère le détail d'une facture par son ID.
   */
  getInvoiceById(id: string): Observable<InvoiceResponse | null> {
    return this.http.get<InvoiceResponse>(`${this.baseUrl}/invoices/${id}`).pipe(
      catchError((err) => {
        console.error(`Erreur lors de la récupération de la facture ${id}:`, err);
        return of(null);
      }),
    );
  }
}
