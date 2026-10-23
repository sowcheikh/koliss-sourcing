import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import {
  AutoRefreshTokenService,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  UserActivityService,
  createInterceptorCondition,
  includeBearerTokenInterceptor,
  provideKeycloak,
  withAutoRefreshToken,
  type IncludeBearerTokenCondition,
} from 'keycloak-angular';

import { environment } from '../environments/environment';
import { routes } from './app.routes';

registerLocaleData(localeFr);

const apiBearerCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /\/(sourcing|fleet|actor)\/api(\/.*)?$/i,
  bearerPrefix: 'Bearer',
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Les paramètres de route et de requête sont liés aux `input()` des composants.
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    provideKeycloak({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      initOptions: {
        // check-sso sans iframe silencieuse : Keycloak refuse le framing
        onLoad: 'check-sso',
        checkLoginIframe: false,
        pkceMethod: 'S256',
        // Query : le callback popup (/connexion/callback?code=) est lisible côté Angular.
        responseMode: 'query',
      },
      features: [
        withAutoRefreshToken({
          onInactivityTimeout: 'logout',
          sessionTimeout: 30 * 60 * 1000,
        }),
      ],
      providers: [AutoRefreshTokenService, UserActivityService],
    }),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [apiBearerCondition],
    },
    provideHttpClient(withFetch(), withInterceptors([includeBearerTokenInterceptor])),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ],
};
