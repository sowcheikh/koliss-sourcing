import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthUser } from '../models/auth.model';
import { ActorCity, ActorCountry, ActorCustomer, CreateProfilRequest } from '../models/actor.model';

const ACTOR_SOURCE = 'KOLISS_SOURCING';

/** Client HTTP vers actor_service (profils / cities / countries). */
@Injectable({ providedIn: 'root' })
export class ActorService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.actorApi;

  getCountries(): Observable<ActorCountry[]> {
    return this.http.get<ActorCountry[]>(`${this.base}/country`);
  }

  getCitiesByCountry(countryId: string): Observable<ActorCity[]> {
    return this.http.get<ActorCity[]>(`${this.base}/city/country/${countryId}`);
  }

  createProfil(payload: CreateProfilRequest): Observable<ActorCustomer> {
    return this.http.post<ActorCustomer>(
      `${this.base}/customer/profil`,
      {
        userId: payload.userId,
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        email: payload.email.trim(),
        phone: payload.phone ? normalizePhone(payload.phone) : undefined,
        companyName: payload.companyName?.trim() || undefined,
      },
      {
        headers: new HttpHeaders({ 'X-Actor-Source': ACTOR_SOURCE }),
      },
    );
  }

  getProfilByUserId(userId: string): Observable<ActorCustomer> {
    return this.http.get<ActorCustomer>(`${this.base}/customer/profil/${userId}`);
  }

  getCustomerById(customerId: string): Observable<ActorCustomer> {
    return this.http.get<ActorCustomer>(`${this.base}/customer/${customerId}`);
  }

  updateProfil(customerId: string, payload: Partial<ActorCustomer>): Observable<ActorCustomer> {
    return this.http.put<ActorCustomer>(
      `${this.base}/customer/profil/${customerId}`,
      payload,
      {
        headers: new HttpHeaders({ 'X-Actor-Source': ACTOR_SOURCE }),
      },
    );
  }

  deleteAccount(customerId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/customer/${customerId}`, {
      headers: new HttpHeaders({ 'X-Actor-Source': ACTOR_SOURCE }),
    });
  }

  /**
   * Résout le customer actor pour un utilisateur Keycloak.
   * Crée automatiquement le profil si absent (même logique que colisage_front et koliss-fleet).
   */
  ensureProfilForUser(user: AuthUser): Observable<ActorCustomer> {
    if (user.customerId) {
      return this.getCustomerById(user.customerId).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status !== 404) {
            return throwError(() => err);
          }
          return this.resolveOrCreateProfil(user);
        }),
      );
    }

    return this.resolveOrCreateProfil(user);
  }

  private resolveOrCreateProfil(user: AuthUser): Observable<ActorCustomer> {
    return this.getProfilByUserId(user.id).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status !== 404) {
          return throwError(() => err);
        }

        if (!user.email?.trim()) {
          return throwError(
            () => new Error('Profil client introuvable. Complétez votre e-mail dans Keycloak.'),
          );
        }

        return this.createProfil({
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.whatsapp || undefined,
          companyName: user.company,
        });
      }),
    );
  }
}

/** Nettoie le numéro de téléphone pour respecter le format actor (+?[0-9]{9,15}). */
export const normalizePhone = (value: string): string => value.replace(/[\s.-]/g, '').trim();
