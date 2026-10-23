/**
 * Configuration runtime KOLISS Sourcing (développement local).
 * Connecté au realm Keycloak koliss-app et client koliss-dev.
 */
const IS_PROD_ENV = false;

const DEV_KEYCLOAK_URL = 'http://localhost:9090';
const PROD_KEYCLOAK_URL = 'https://keycloak.yoni-ap.com';

const KEYCLOAK_URL = IS_PROD_ENV ? PROD_KEYCLOAK_URL : DEV_KEYCLOAK_URL;

export const environment = {
  production: IS_PROD_ENV,
  apiBaseUrl: 'http://localhost:8084/sourcing/api',
  actorApi: 'http://localhost:8084/actor/api',
  actorKeycloakApi: 'http://localhost:8084/actor/keycloak/api',
  keycloak: {
    url: KEYCLOAK_URL,
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
