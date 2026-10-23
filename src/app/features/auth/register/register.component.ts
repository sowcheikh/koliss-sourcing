import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { SocialAuthService } from '../../../core/services/social-auth.service';

/** Page d'inscription client Sourcing (Keycloak + Google / Facebook). */
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly socialAuth = inject(SocialAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Propagé vers /connexion pour boucler le flux (ex. retour devis). */
  protected readonly returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

  protected readonly submitting = signal(false);
  protected readonly oauthLoading = signal<'google' | 'facebook' | null>(null);
  protected readonly showPassword = signal(false);
  protected readonly showConfirm = signal(false);
  protected readonly globalError = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]],
    },
    { validators: passwordMatchValidator },
  );

  protected togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }

  protected toggleConfirm(): void {
    this.showConfirm.update((visible) => !visible);
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    this.globalError.set(null);
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    this.submitting.set(true);
    void this.auth
      .register({
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        password: value.password,
      })
      .then(() => {
        this.submitting.set(false);
        void this.router.navigate(['/connexion'], {
          queryParams: {
            registered: '1',
            email: value.email.trim(),
            ...(this.returnUrl ? { returnUrl: this.returnUrl } : {}),
          },
        });
      })
      .catch((err: unknown) => {
        this.submitting.set(false);
        this.globalError.set(
          err instanceof Error ? err.message : "L'inscription a échoué. Réessayez.",
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
    this.auth.rememberReturnUrl('/compte');

    try {
      const result = await this.socialAuth.loginWithSocialProvider(provider);
      if (!result.success) {
        throw new Error(result.error || 'Inscription sociale impossible.');
      }
      window.location.assign(this.auth.consumeReturnUrl('/compte'));
    } catch (err: unknown) {
      this.oauthLoading.set(null);
      this.globalError.set(
        err instanceof Error ? err.message : 'Inscription sociale impossible. Réessayez.',
      );
    }
  }
}

const passwordMatchValidator = (group: AbstractControl) => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  if (!password || !confirm) {
    return null;
  }
  return password === confirm ? null : { passwordMismatch: true };
};
