import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/guards/auth.guard';

const TITLE_SUFFIX = 'KOLISS Sourcing';

/** Toutes les pages sont chargées à la demande (lazy loading). */
export const routes: Routes = [
  {
    path: '',
    title: `${TITLE_SUFFIX} — 1ère Marketplace B2B Gros pour l'Afrique`,
    loadComponent: () =>
      import('./features/home/pages/home-page/home-page.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'boutique',
    title: `Boutique Sourcing B2B — ${TITLE_SUFFIX}`,
    loadComponent: () =>
      import('./features/catalog/pages/catalog-page/catalog-page.component').then(
        (m) => m.CatalogPageComponent,
      ),
  },
  {
    // Le titre de l'onglet est défini dynamiquement par la page (nom du produit).
    path: 'boutique/:id',
    loadComponent: () =>
      import('./features/product/pages/product-page/product-page.component').then(
        (m) => m.ProductPageComponent,
      ),
  },
  {
    path: 'solutions',
    title: `Solutions — ${TITLE_SUFFIX}`,
    loadComponent: () =>
      import('./features/solutions/pages/solutions-page/solutions-page.component').then(
        (m) => m.SolutionsPageComponent,
      ),
  },
  {
    path: 'devis',
    title: `Demande de devis gratuit — ${TITLE_SUFFIX}`,
    loadComponent: () =>
      import('./features/quote/pages/quote-page/quote-page.component').then(
        (m) => m.QuotePageComponent,
      ),
  },
  {
    path: 'connexion',
    title: `Connexion client — ${TITLE_SUFFIX}`,
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'inscription',
    title: `Inscription gratuite — ${TITLE_SUFFIX}`,
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'connexion/callback',
    title: `Authentification en cours — ${TITLE_SUFFIX}`,
    loadComponent: () =>
      import('./features/auth/callback/auth-callback.component').then(
        (m) => m.AuthCallbackComponent,
      ),
  },
  {
    path: 'compte',
    title: `Mon espace client — ${TITLE_SUFFIX}`,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/account/account-page.component').then((m) => m.AccountPageComponent),
  },
  { path: '**', redirectTo: '' },
];
