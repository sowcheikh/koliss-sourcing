/** Pays actor (GET /country). */
export interface ActorCountry {
  readonly id: string;
  readonly countryName: string;
  readonly countryCode: string;
  readonly areaCode?: string | null;
  readonly currency?: string | null;
  readonly usePostalCode?: boolean | null;
}

/** Ville actor (GET /city/country/:id). */
export interface ActorCity {
  readonly id: string;
  readonly cityName: string;
  readonly postalCode?: string | null;
  readonly country?: ActorCountry | null;
}

/** Réponse Customer / Profil actor. */
export interface ActorCustomer {
  readonly id: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly userId?: string | null;
  readonly companyName?: string;
  readonly address?: string | null;
  readonly postal?: string | null;
  readonly city?: ActorCity | null;
  readonly billingAddress?: string | null;
  readonly billingPostal?: string | null;
  readonly billingCity?: ActorCity | null;
}

/** Création profil actor lié à un userId Keycloak (POST /customer/profil). */
export interface CreateProfilRequest {
  readonly userId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone?: string;
  readonly companyName?: string;
}
