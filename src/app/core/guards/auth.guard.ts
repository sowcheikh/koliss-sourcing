import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Keycloak from 'keycloak-js';

/** Protège les routes espace client / compte — redirige vers /connexion si invité. */
export const authGuard: CanActivateFn = () => {
  const keycloak = inject(Keycloak);
  const router = inject(Router);

  if (keycloak.authenticated) {
    return true;
  }

  return router.createUrlTree(['/connexion'], {
    queryParams: { returnUrl: router.url },
  });
};

/** Empêche un client déjà connecté d'accéder aux pages /connexion ou /inscription. */
export const guestGuard: CanActivateFn = () => {
  const keycloak = inject(Keycloak);
  const router = inject(Router);

  if (!keycloak.authenticated) {
    return true;
  }

  return router.createUrlTree(['/compte']);
};
