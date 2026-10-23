/** Rôle applicatif — l'admin est géré hors de ce front. */
export type UserRole = 'client';

/** Utilisateur authentifié (session client). */
export interface AuthUser {
  readonly id: string;
  /** Identifiant customer actor (profil lié à Keycloak). */
  readonly customerId?: string;
  readonly role: UserRole;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly whatsapp?: string;
  readonly company?: string;
  readonly city?: string;
}

/** Corps formulaire de connexion (Direct Access Grants → Keycloak). */
export interface LoginRequest {
  readonly login: string;
  readonly password: string;
}

/** Création de compte (actor Keycloak, même contrat que colisage_front et koliss-fleet). */
export interface RegisterRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
}
