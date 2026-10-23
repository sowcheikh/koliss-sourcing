import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import Keycloak from 'keycloak-js';

import { environment } from '../../../environments/environment';

export interface SocialAuthResult {
  readonly success: boolean;
  readonly error?: string;
}

/**
 * OAuth Google / Facebook via Keycloak Identity Brokering (popup).
 * Utilise createLoginUrl({ idpHint }) pour générer kc_idp_hint + PKCE + state,
 * ce qui redirige directement vers Google/Facebook au lieu de la page login Keycloak.
 */
@Injectable({ providedIn: 'root' })
export class SocialAuthService {
  private readonly keycloak = inject(Keycloak);
  private readonly router = inject(Router);

  async loginWithSocialProvider(provider: 'google' | 'facebook'): Promise<SocialAuthResult> {
    return new Promise((resolve) => {
      void (async () => {
        try {
          const redirectUri = `${window.location.origin}/connexion/callback`;
          const loginUrl = await this.keycloak.createLoginUrl({
            idpHint: this.idpAlias(provider),
            redirectUri,
            scope: 'openid profile email',
          });

          const popup = this.openPopup(loginUrl, 'keycloak-social-login', 600, 700);

          if (!popup) {
            resolve({
              success: false,
              error: 'Impossible d’ouvrir la popup. Autorisez les popups pour ce site.',
            });
            return;
          }

          let checkClosed: ReturnType<typeof setInterval> | undefined;
          let timeoutId: ReturnType<typeof setTimeout> | undefined;

          const cleanup = (): void => {
            window.removeEventListener('message', messageListener);
            if (checkClosed) {
              clearInterval(checkClosed);
            }
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
          };

          const messageListener = (event: MessageEvent): void => {
            if (event.origin !== window.location.origin) {
              return;
            }

            const data = event.data as { type?: string; error?: string } | null;
            if (!data?.type) {
              return;
            }

            if (data.type === 'KEYCLOAK_SOCIAL_AUTH_SUCCESS') {
              cleanup();
              popup.close();
              resolve({ success: true });
              return;
            }

            if (data.type === 'KEYCLOAK_SOCIAL_AUTH_ERROR') {
              cleanup();
              popup.close();
              resolve({
                success: false,
                error: data.error || 'Erreur d’authentification',
              });
            }
          };

          window.addEventListener('message', messageListener);

          checkClosed = setInterval(() => {
            if (popup.closed) {
              cleanup();
              resolve({ success: false, error: 'Authentification annulée' });
            }
          }, 1000);

          timeoutId = setTimeout(() => {
            if (!popup.closed) {
              popup.close();
            }
            cleanup();
            resolve({ success: false, error: 'Timeout : authentification trop longue' });
          }, 300_000);
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Erreur inconnue';
          resolve({ success: false, error: message });
        }
      })();
    });
  }

  async handleSocialAuthCallback(): Promise<void> {
    const { error, errorDescription, code } = this.readCallbackParams();

    const postToOpener = (payload: Record<string, unknown>): void => {
      if (window.opener) {
        window.opener.postMessage(payload, window.location.origin);
      }
    };

    if (error) {
      const errorMessage = errorDescription || error || 'Erreur d’authentification';
      if (window.opener) {
        postToOpener({ type: 'KEYCLOAK_SOCIAL_AUTH_ERROR', error: errorMessage });
        setTimeout(() => window.close(), 500);
      } else {
        await this.router.navigate(['/connexion'], {
          queryParams: { error: errorMessage },
        });
      }
      return;
    }

    if (this.keycloak.authenticated || code) {
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (window.opener) {
        postToOpener({ type: 'KEYCLOAK_SOCIAL_AUTH_SUCCESS', code });
        await new Promise((resolve) => setTimeout(resolve, 300));
        window.close();
        return;
      }

      await this.router.navigateByUrl('/compte');
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (this.keycloak.authenticated) {
      if (window.opener) {
        postToOpener({ type: 'KEYCLOAK_SOCIAL_AUTH_SUCCESS' });
        setTimeout(() => window.close(), 500);
      } else {
        await this.router.navigateByUrl('/compte');
      }
      return;
    }

    const errorMsg = 'Authentification échouée : aucun code reçu.';
    if (window.opener) {
      postToOpener({ type: 'KEYCLOAK_SOCIAL_AUTH_ERROR', error: errorMsg });
      window.close();
    } else {
      await this.router.navigate(['/connexion'], { queryParams: { error: errorMsg } });
    }
  }

  /** Alias Identity Provider Keycloak (onglet Identity providers du realm). */
  private idpAlias(provider: 'google' | 'facebook'): string {
    return environment.keycloak.idpHints?.[provider] ?? provider;
  }

  private readCallbackParams(): {
    error: string | null;
    errorDescription: string | null;
    code: string | null;
  } {
    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    return {
      error: query.get('error') ?? hash.get('error'),
      errorDescription: query.get('error_description') ?? hash.get('error_description'),
      code: query.get('code') ?? hash.get('code'),
    };
  }

  private openPopup(url: string, name: string, width: number, height: number): Window | null {
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    return window.open(
      url,
      name,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    );
  }
}
