import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  typeEventArgs,
  type ReadyArgs,
} from 'keycloak-angular';
import Keycloak, { type KeycloakProfile, type KeycloakTokenParsed } from 'keycloak-js';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ActorCustomer } from '../models/actor.model';
import { AuthUser, LoginRequest, RegisterRequest } from '../models/auth.model';

const RETURN_URL_KEY = 'ks_auth_return_url';

interface KeycloakTokenResponse {
  readonly access_token: string;
  readonly refresh_token?: string;
  readonly id_token?: string;
  readonly expires_in?: number;
  readonly refresh_expires_in?: number;
}

/**
 * Service d'authentification client KOLISS Sourcing — Keycloak central (même realm que colisage_front et koliss-fleet).
 * Email/mdp via Direct Access Grants ; Google/Facebook via SocialAuthService.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak = inject(Keycloak);
  private readonly http = inject(HttpClient);
  private readonly keycloakEvents = inject(KEYCLOAK_EVENT_SIGNAL);

  private readonly currentUser = signal<AuthUser | null>(null);

  readonly user = this.currentUser.asReadonly();

  constructor() {
    effect(() => {
      const event = this.keycloakEvents();

      if (event.type === KeycloakEventType.Ready) {
        const authenticated = typeEventArgs<ReadyArgs>(event.args);
        if (authenticated) {
          void this.syncUserFromKeycloak();
        } else {
          this.currentUser.set(null);
        }
        return;
      }

      if (
        event.type === KeycloakEventType.AuthSuccess ||
        event.type === KeycloakEventType.AuthRefreshSuccess
      ) {
        void this.syncUserFromKeycloak();
        return;
      }

      if (event.type === KeycloakEventType.AuthLogout) {
        this.currentUser.set(null);
      }
    });
  }

  isAuthenticated(): boolean {
    return !!this.keycloak.authenticated;
  }

  /** Connexion email/mdp via endpoint token Keycloak (comme colisage_front et koliss-fleet). */
  async login(payload: LoginRequest): Promise<void> {
    const { url, realm, clientId } = environment.keycloak;
    const tokenUrl = `${url}/realms/${realm}/protocol/openid-connect/token`;

    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', clientId);
    body.set('username', payload.login.trim());
    body.set('password', payload.password);

    let response: KeycloakTokenResponse;
    try {
      response = await firstValueFrom(
        this.http.post<KeycloakTokenResponse>(tokenUrl, body.toString(), {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        }),
      );
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 401) {
        throw new Error('Identifiant ou mot de passe incorrect.');
      }
      if (status === 400) {
        throw new Error('Identifiants invalides ou compte non autorisé.');
      }
      throw new Error('Connexion impossible. Réessayez.');
    }

    if (!response?.access_token) {
      throw new Error('Réponse invalide de Keycloak.');
    }

    this.applyTokenResponse(response);
    await this.syncUserFromKeycloak();
  }

  /** Inscription email/mdp via actor (crée l'utilisateur Keycloak, comme colisage_front et koliss-fleet). */
  async register(payload: RegisterRequest): Promise<void> {
    const url = `${environment.actorKeycloakApi}/user`;
    try {
      await firstValueFrom(
        this.http.post(
          url,
          {
            email: payload.email.trim(),
            password: payload.password,
            firstName: payload.firstName.trim(),
            lastName: payload.lastName.trim(),
          },
          {
            headers: new HttpHeaders({ 'X-Actor-Source': 'KOLISS_SOURCING' }),
          },
        ),
      );
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 409) {
        throw new Error('Un compte existe déjà avec cette adresse e-mail.');
      }
      if (status === 0 || status === 404 || status === 502) {
        throw new Error("Service d'inscription indisponible. Réessayez plus tard.");
      }
      throw new Error("L'inscription a échoué. Réessayez.");
    }
  }

  async logout(): Promise<void> {
    this.currentUser.set(null);
    this.clearStoredTokens();
    await this.keycloak.logout({
      redirectUri: `${window.location.origin}/`,
    });
  }

  openAccountManagement(): void {
    try {
      void this.keycloak.accountManagement();
    } catch {
      const { url, realm } = environment.keycloak;
      window.open(`${url}/realms/${realm}/account`, '_blank');
    }
  }

  rememberReturnUrl(url: string): void {
    sessionStorage.setItem(RETURN_URL_KEY, url);
  }

  consumeReturnUrl(fallback = '/compte'): string {
    const stored = sessionStorage.getItem(RETURN_URL_KEY);
    sessionStorage.removeItem(RETURN_URL_KEY);
    return stored || fallback;
  }

  async syncUserFromKeycloak(): Promise<void> {
    if (!this.keycloak.authenticated) {
      this.currentUser.set(null);
      return;
    }

    try {
      const profile = await this.keycloak.loadUserProfile();
      this.currentUser.set(this.mapProfile(profile));
    } catch {
      const parsed = this.keycloak.tokenParsed as KeycloakTokenParsed | undefined;
      if (parsed) {
        this.currentUser.set(this.mapToken(parsed));
      } else {
        this.currentUser.set(null);
      }
    }
  }

  /** Enrichit la session client avec le profil actor (téléphone, entreprise, customerId). */
  mergeActorProfile(actor: ActorCustomer): void {
    const current = this.currentUser();
    if (!current) {
      return;
    }

    this.currentUser.set({
      ...current,
      customerId: actor.id,
      firstName: actor.firstName?.trim() || current.firstName,
      lastName: actor.lastName?.trim() || current.lastName,
      email: actor.email?.trim() || current.email,
      whatsapp: actor.phone?.trim() || current.whatsapp,
      company: actor.companyName?.trim() || current.company,
    });
  }

  private applyTokenResponse(response: KeycloakTokenResponse): void {
    const { realm, clientId } = environment.keycloak;

    this.keycloak.token = response.access_token;
    this.keycloak.refreshToken = response.refresh_token ?? '';
    this.keycloak.idToken = response.id_token ?? '';
    this.keycloak.authenticated = true;
    this.keycloak.tokenParsed = this.parseJwt(response.access_token);
    if (response.id_token) {
      this.keycloak.idTokenParsed = this.parseJwt(response.id_token);
    }
    if (response.refresh_token) {
      this.keycloak.refreshTokenParsed = this.parseJwt(response.refresh_token);
    }
    if (response.expires_in) {
      this.keycloak.tokenParsed = {
        ...(this.keycloak.tokenParsed ?? {}),
        exp: Math.floor(Date.now() / 1000) + response.expires_in,
      };
    }

    localStorage.setItem(`kc-access-token-${realm}-${clientId}`, response.access_token);
    if (response.refresh_token) {
      localStorage.setItem(`kc-refresh-token-${realm}-${clientId}`, response.refresh_token);
    }
    if (response.id_token) {
      localStorage.setItem(`kc-id-token-${realm}-${clientId}`, response.id_token);
    }
    if (response.expires_in) {
      localStorage.setItem(
        `kc-access-token-${realm}-${clientId}-expires`,
        String(Date.now() + response.expires_in * 1000),
      );
    }
  }

  private clearStoredTokens(): void {
    const { realm, clientId } = environment.keycloak;
    localStorage.removeItem(`kc-access-token-${realm}-${clientId}`);
    localStorage.removeItem(`kc-refresh-token-${realm}-${clientId}`);
    localStorage.removeItem(`kc-id-token-${realm}-${clientId}`);
    localStorage.removeItem(`kc-access-token-${realm}-${clientId}-expires`);
  }

  private mapProfile(profile: KeycloakProfile): AuthUser {
    const attrs = profile.attributes as Record<string, string[] | undefined> | undefined;
    const phone = attrs?.['phone']?.[0] ?? attrs?.['whatsapp']?.[0] ?? '';

    return {
      id: profile.id ?? '',
      role: 'client',
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      email: profile.email ?? '',
      whatsapp: phone,
    };
  }

  private mapToken(parsed: KeycloakTokenParsed): AuthUser {
    return {
      id: String(parsed['sub'] ?? ''),
      role: 'client',
      firstName: String(parsed['given_name'] ?? ''),
      lastName: String(parsed['family_name'] ?? ''),
      email: String(parsed['email'] ?? parsed['preferred_username'] ?? ''),
      whatsapp: '',
    };
  }

  private parseJwt(token: string): KeycloakTokenParsed {
    try {
      const base64 = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
      if (!base64) {
        return {};
      }
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
          .join(''),
      );
      return JSON.parse(json) as KeycloakTokenParsed;
    } catch {
      return {};
    }
  }
}
