import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CONTACT, WHATSAPP_URL } from '../../../../core/config/site.config';
import { AuthService } from '../../../../core/services/auth.service';
import { CatalogService } from '../../../../core/services/catalog.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { QuoteService } from '../../../../core/services/quote.service';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { QuoteRequest, QuoteSubmissionResult } from '../../../../shared/models/quote.model';

interface QuoteCategoryOption {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
}

const CATEGORY_OPTIONS: readonly QuoteCategoryOption[] = [
  { id: 'solaire', label: 'Énergie Solaire', icon: 'pi-sun' },
  { id: 'indus', label: 'Machines Indus.', icon: 'pi-cog' },
  { id: 'agricole', label: 'Matériel Agricole', icon: 'pi-cloud' },
  { id: 'btp', label: 'BTP & Construction', icon: 'pi-hammer' },
  { id: 'medical', label: 'Médical', icon: 'pi-heart' },
  { id: 'chimie', label: 'Produits Chimiques', icon: 'pi-filter' },
  { id: 'eau', label: 'Eau & Irrigation', icon: 'pi-box' },
  { id: 'agro', label: 'Transfo. Alimentaire', icon: 'pi-warehouse' },
  { id: 'engins', label: 'Engins & Véhicules', icon: 'pi-car' },
  { id: 'autre', label: 'Autre catégorie', icon: 'pi-ellipsis-h' },
];

const COUNTRIES: readonly string[] = [
  '🇸🇳 Sénégal – Dakar',
  '🇲🇱 Mali – Bamako',
  "🇨🇮 Côte d'Ivoire – Abidjan",
  '🇬🇳 Guinée – Conakry',
  '🇬🇭 Ghana – Accra',
  '🇧🇯 Bénin – Cotonou',
  '🇹🇬 Togo – Lomé',
  '🇧🇫 Burkina Faso – Ouagadougou',
  '🇫🇷 France',
  'Autre pays d’Afrique / International',
];

const BUDGET_OPTIONS: readonly string[] = [
  'Non précisé',
  'Moins de 2 000 USD (≈ 1,2M FCFA)',
  '2 000 – 10 000 USD (≈ 1,2M – 6M FCFA)',
  '10 000 – 50 000 USD (≈ 6M – 30M FCFA)',
  '50 000 – 200 000 USD (≈ 30M – 120M FCFA)',
  'Plus de 200 000 USD (+120M FCFA)',
];

@Component({
  selector: 'app-quote-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    BreadcrumbComponent,
    ButtonComponent,
    FormFieldComponent,
  ],
  templateUrl: './quote-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotePageComponent {
  /** Query params injectés par le routeur */
  readonly produit = input<string>();
  readonly qte = input<string>();
  readonly formule = input<string>();

  private readonly fb = inject(FormBuilder);
  private readonly catalogService = inject(CatalogService);
  private readonly quoteService = inject(QuoteService);
  private readonly notificationService = inject(NotificationService);
  protected readonly auth = inject(AuthService);

  protected readonly breadcrumb: readonly BreadcrumbItem[] = [
    { label: 'Accueil', link: '/' },
    { label: 'Demande de devis' },
  ];

  protected readonly categoryOptions = CATEGORY_OPTIONS;
  protected readonly countries = COUNTRIES;
  protected readonly budgetOptions = BUDGET_OPTIONS;
  protected readonly contact = CONTACT;
  protected readonly whatsappUrl = WHATSAPP_URL;

  protected readonly selectedCategories = signal<string[]>([]);
  protected readonly isSubmitting = signal(false);
  protected readonly isSubmitted = signal(false);
  protected readonly submissionResult = signal<QuoteSubmissionResult | null>(null);

  protected readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(6)]],
    company: [''],
    position: [''],
    country: ['', Validators.required],
    deliveryMode: ['Aérien (7–10 jours)'],
    notes: [''],
    budget: [''],
    products: this.fb.array([this.createProductRow()]),
  });

  get productRows(): FormArray {
    return this.form.get('products') as FormArray;
  }

  constructor() {
    // Préremplissage automatique des coordonnées si l'utilisateur est connecté
    effect(() => {
      const u = this.auth.user();
      if (u) {
        this.form.patchValue({
          firstName: u.firstName || this.form.get('firstName')?.value,
          lastName: u.lastName || this.form.get('lastName')?.value,
          email: u.email || this.form.get('email')?.value,
          phone: u.whatsapp || this.form.get('phone')?.value,
          company: u.company || this.form.get('company')?.value,
        });
      }
    });

    // Préremplissage automatique si l'utilisateur arrive depuis un produit ou une formule
    effect(() => {
      const prodId = this.produit();
      if (!prodId) {
        return;
      }

      this.catalogService.getProductById(prodId).subscribe((product) => {
        if (!product) {
          return;
        }

        const qtyVal = parseInt(this.qte() ?? '', 10) || product.tiers[0]?.minQty || 1;

        // Met à jour la première ligne de produit
        const firstRow = this.productRows.at(0);
        if (firstRow) {
          firstRow.patchValue({
            name: product.name,
            quantity: qtyVal,
            unit: product.unit,
          });
        }

        // Active automatiquement la catégorie correspondante
        if (!this.selectedCategories().includes(product.category)) {
          this.selectedCategories.update((cats) => [...cats, product.category]);
        }
      });
    });

    effect(() => {
      const f = this.formule();
      if (f) {
        const label = f === 'starter' ? 'Starter (5%)' : f === 'pro' ? 'Pro PME (3.5%)' : 'OEM & Marque Propre';
        const currentNotes = this.form.get('notes')?.value || '';
        if (!currentNotes.includes('Formule souhaitée')) {
          this.form.patchValue({
            notes: `Formule souhaitée : ${label}\n${currentNotes}`.trim(),
          });
        }
      }
    });
  }

  protected createProductRow(name = '', quantity: number | null = null, unit = 'unités'): FormGroup {
    return this.fb.group({
      name: [name, Validators.required],
      quantity: [quantity, [Validators.required, Validators.min(1)]],
      unit: [unit],
    });
  }

  protected addProductRow(): void {
    this.productRows.push(this.createProductRow());
  }

  protected removeProductRow(index: number): void {
    if (this.productRows.length > 1) {
      this.productRows.removeAt(index);
    }
  }

  protected toggleCategory(catId: string): void {
    this.selectedCategories.update((cats) =>
      cats.includes(catId) ? cats.filter((id) => id !== catId) : [...cats, catId],
    );
  }

  protected isCategorySelected(catId: string): boolean {
    return this.selectedCategories().includes(catId);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.warning(
        'Veuillez renseigner tous les champs obligatoires (prénom, nom, email, téléphone, pays et votre produit).',
      );
      return;
    }

    this.isSubmitting.set(true);

    const val = this.form.getRawValue();
    const currentUser = this.auth.user();
    const request: QuoteRequest = {
      customerId: currentUser?.customerId || currentUser?.id,
      firstName: val.firstName ?? '',
      lastName: val.lastName ?? '',
      email: val.email ?? '',
      phone: val.phone ?? '',
      company: val.company ?? '',
      position: val.position ?? '',
      country: val.country ?? '',
      deliveryMode: val.deliveryMode ?? 'Aérien',
      categories: this.selectedCategories(),
      products: (val.products ?? []).map((p) => ({
        name: (p as { name?: string })['name'] ?? '',
        quantity: (p as { quantity?: number })['quantity'] ?? 1,
        unit: (p as { unit?: string })['unit'] ?? 'unité',
      })),
      notes: val.notes ?? '',
      budget: val.budget ?? '',
    };

    this.quoteService.submitQuote(request).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.submissionResult.set(res);
        this.isSubmitted.set(true);
        this.notificationService.success(
          'Votre demande de devis a été envoyée avec succès ! Un agent vous contactera sous 48h.',
        );
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        this.isSubmitting.set(false);
        this.notificationService.error(
          'Une erreur est survenue lors de l’envoi. Veuillez réessayer ou nous contacter sur WhatsApp.',
        );
      },
    });
  }

  protected resetForm(): void {
    this.form.reset({
      deliveryMode: 'Aérien (7–10 jours)',
    });
    this.productRows.clear();
    this.productRows.push(this.createProductRow());
    this.selectedCategories.set([]);
    this.submissionResult.set(null);
    this.isSubmitted.set(false);
  }
}
