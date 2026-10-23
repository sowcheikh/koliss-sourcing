import { Component, OnInit, inject } from '@angular/core';

import { SocialAuthService } from '../../../core/services/social-auth.service';

/** Callback OAuth Keycloak (popup Google / Facebook). */
@Component({
  selector: 'app-auth-callback',
  template: `
    <div class="callback" role="status" aria-live="polite">
      <div class="flex flex-col items-center gap-3">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-koliss-primary border-t-transparent"></div>
        <p class="text-sm font-semibold text-koliss-text">Traitement de l'authentification en cours…</p>
      </div>
    </div>
  `,
  styles: `
    .callback {
      display: grid;
      place-items: center;
      min-height: 100vh;
      font-family: var(--k-font-body, system-ui, sans-serif);
      background-color: var(--k-bg, #fdfaef);
    }
  `,
})
export class AuthCallbackComponent implements OnInit {
  private readonly socialAuth = inject(SocialAuthService);

  async ngOnInit(): Promise<void> {
    await this.socialAuth.handleSocialAuthCallback();
  }
}
