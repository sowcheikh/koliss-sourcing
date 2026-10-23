/**
 * Configuration runtime KOLISS Sourcing (production).
 * Connecté à la gateway centrale et au realm Keycloak koliss-app.
 */
const GATEWAY_URL_LOCAL = 'http://localhost:8084';
const GATEWAY_URL_PROD = 'https://gateway.yoni-ap.com';
const IS_PROD_ENV = false;

export const environment = {
  production: IS_PROD_ENV,
  apiBaseUrl: IS_PROD_ENV ? `${GATEWAY_URL_PROD}/sourcing/api` : 'http://localhost:8095/sourcing/api',
  actorApi: IS_PROD_ENV ? `${GATEWAY_URL_PROD}/actor/api` : `${GATEWAY_URL_LOCAL}/actor/api`,
  actorKeycloakApi: IS_PROD_ENV
    ? `${GATEWAY_URL_PROD}/actor/keycloak/api`
    : `${GATEWAY_URL_LOCAL}/actor/keycloak/api`,
  keycloak: {
    url: IS_PROD_ENV ? 'https://keycloak.yoni-ap.com' : 'http://localhost:9090',
    realm: 'koliss-app',
    clientId: IS_PROD_ENV ? 'sourcing-client' : 'koliss-dev',
    idpHints: {
      google: 'google',
      facebook: 'facebook',
    },
  },
  contact: {
    whatsapp: '221787860404',
  },
} as const;
