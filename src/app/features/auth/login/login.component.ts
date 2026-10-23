import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { SocialAuthService } from '../../../core/services/social-auth.service';

/** Page de connexion client (Keycloak : email/mdp + Google / Facebook). */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly socialAuth = inject(SocialAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly submitting = signal(false);
  protected readonly oauthLoading = signal<'google' | 'facebook' | null>(null);
  protected readonly showPassword = signal(false);
  protected readonly globalError = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

  /** Propagé au lien « S'inscrire » pour conserver le parcours utilisateur (ex. retour devis). */
  protected readonly returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

  protected readonly form = this.fb.nonNullable.group({
    login: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  constructor() {
    const params = this.route.snapshot.queryParamMap;
    const error = params.get('error');
    if (error) {
      this.globalError.set(error);
    }
    if (params.get('registered') === '1') {
      this.successMessage.set('Votre compte a été créé avec succès. Connectez-vous pour continuer.');
    }
    const email = params.get('email');
    if (email) {
      this.form.controls.login.setValue(email);
    }
  }

  protected togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    this.globalError.set(null);
    if (this.form.invalid) {
      return;
    }

    this.submitting.set(true);
    void this.auth
      .login(this.form.getRawValue())
      .then(() => this.afterLogin())
      .catch((err: unknown) => {
        this.submitting.set(false);
        this.globalError.set(
          err instanceof Error ? err.message : 'Connexion impossible. Veuillez vérifier vos identifiants.',
        );
      });
  }

  protected handleGoogle(): void {
    void this.startOAuth('google');
  }

  protected handleFacebook(): void {
    void this.startOAuth('facebook');
  }

  private async startOAuth(provider: 'google' | 'facebook'): Promise<void> {
    this.globalError.set(null);
    this.oauthLoading.set(provider);

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/compte';
    this.auth.rememberReturnUrl(returnUrl);

    try {
      const result = await this.socialAuth.loginWithSocialProvider(provider);
      if (!result.success) {
        throw new Error(result.error || 'Connexion sociale impossible.');
      }
      // Recharge pour que check-sso récupère la session Keycloak (comme colisage_front et koliss-fleet).
      window.location.assign(this.auth.consumeReturnUrl(returnUrl));
    } catch (err: unknown) {
      this.oauthLoading.set(null);
      this.globalError.set(
        err instanceof Error ? err.message : 'Connexion sociale impossible. Réessayez.',
      );
    }
  }

  private afterLogin(): void {
    this.submitting.set(false);
    this.oauthLoading.set(null);
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/compte';
    void this.router.navigateByUrl(returnUrl);
  }
}
