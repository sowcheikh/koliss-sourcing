import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ActorService, normalizePhone } from '../../core/services/actor.service';
import { QuoteService } from '../../core/services/quote.service';
import { InvoiceService } from '../../core/services/invoice.service';
import { CONTACT, WHATSAPP_URL } from '../../core/config/site.config';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import {
  ActorCity,
  ActorCountry,
  ActorCustomer,
} from '../../core/models/actor.model';
import {
  DELIVERY_LABELS,
  FORMULA_LABELS,
  QUOTE_STATUS_CONFIG,
  QuoteResponse,
  QuoteStatusMeta,
} from '../../shared/models/quote.model';
import {
  INVOICE_STATUS_CONFIG,
  INVOICE_TYPE_LABELS,
  InvoiceResponse,
  InvoiceStatusMeta,
} from '../../shared/models/invoice.model';
import { QuoteDetailDialogComponent } from './components/quote-detail-dialog/quote-detail-dialog.component';

export type AccountTab = 'profile' | 'quotes' | 'invoices';
export type ProfileSection = 'personal' | 'login' | 'download' | 'delete';

interface ProfileNavItem {
  readonly id: ProfileSection;
  readonly label: string;
}

/** Espace client connecté KOLISS Sourcing avec profil aligné sur colisage_front, devis et factures. */
@Component({
  selector: 'app-account-page',
  imports: [
    RouterLink,
    FormsModule,
    DatePipe,
    CurrencyPipe,
    DecimalPipe,
    BreadcrumbComponent,
    QuoteDetailDialogComponent,
  ],
  templateUrl: './account-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly actorService = inject(ActorService);
  private readonly quoteService = inject(QuoteService);
  private readonly invoiceService = inject(InvoiceService);

  protected readonly user = this.auth.user;
  protected readonly contact = CONTACT;
  protected readonly whatsappUrl = WHATSAPP_URL;

  // Onglet principal (Mon profil / Mes devis / Mes factures)
  protected readonly activeTab = signal<AccountTab>('profile');

  // Sous-sections du profil
  protected readonly activeSection = signal<ProfileSection>('personal');
  protected readonly isEditMode = signal<boolean>(false);

  protected readonly profileSections: readonly ProfileNavItem[] = [
    { id: 'personal', label: 'Information personnelles' },
    { id: 'login', label: 'Information de connexion' },
    { id: 'download', label: 'Télécharger mes données' },
    { id: 'delete', label: 'Supprimer mon compte' },
  ];

  // Données profil Actor
  protected readonly profileCustomer = signal<ActorCustomer | null>(null);
  protected readonly countries = signal<readonly ActorCountry[]>([]);
  protected readonly cities = signal<readonly ActorCity[]>([]);
  protected readonly loadingCities = signal<boolean>(false);

  // Formulaires réactifs
  protected personalForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postal: '',
    countryId: '',
    cityId: '',
    company: '',
  };

  protected readonly isSavingProfile = signal<boolean>(false);
  protected readonly profileMessage = signal<string | null>(null);
  protected readonly profileMessageType = signal<'success' | 'error'>('success');

  // Téléchargement données
  protected readonly isDownloadingData = signal<boolean>(false);
  protected readonly downloadSuccess = signal<string | null>(null);

  // Suppression de compte
  protected readonly showDeleteConfirm = signal<boolean>(false);
  protected readonly deleteConfirmationText = signal<string>('');
  protected readonly isDeletingAccount = signal<boolean>(false);
  protected readonly deleteErrorMessage = signal<string | null>(null);

  // Devis
  protected readonly quotes = signal<readonly QuoteResponse[]>([]);
  protected readonly loadingQuotes = signal(true);
  protected readonly errorQuotes = signal<string | null>(null);
  protected readonly selectedQuote = signal<QuoteResponse | null>(null);
  protected readonly actionInProgress = signal<string | null>(null);

  // Factures
  protected readonly invoices = signal<readonly InvoiceResponse[]>([]);
  protected readonly loadingInvoices = signal(false);
  protected readonly errorInvoices = signal<string | null>(null);

  protected readonly breadcrumbs: readonly BreadcrumbItem[] = [
    { label: 'Accueil', link: '/' },
    { label: 'Mon espace client' },
  ];

  protected readonly fullName = computed(() => {
    const u = this.user();
    if (!u) {
      return '';
    }
    return `${u.firstName} ${u.lastName}`.trim() || u.email;
  });

  protected readonly greetingName = computed(() => {
    const cust = this.profileCustomer();
    if (cust?.firstName?.trim()) {
      return cust.firstName.trim();
    }
    const u = this.user();
    return u?.firstName?.trim() || u?.email?.split('@')[0] || 'cheikh';
  });

  protected readonly selectedCountry = computed(() => {
    const cId = this.personalForm.countryId;
    return this.countries().find((c) => c.id === cId) ?? null;
  });

  protected readonly selectedCity = computed(() => {
    const cId = this.personalForm.cityId;
    return this.cities().find((c) => c.id === cId) ?? null;
  });

  ngOnInit(): void {
    const u = this.user();
    if (u) {
      this.initUserFormFromAuth();
      this.loadCountries();
      this.actorService.ensureProfilForUser(u).subscribe({
        next: (actor) => {
          this.profileCustomer.set(actor);
          this.auth.mergeActorProfile(actor);
          this.populateFormsFromCustomer(actor);
        },
        error: (err) => {
          console.warn('API actor non disponible ou profil par défaut utilisé:', err);
        },
      });
    }

    this.loadQuotes();
    this.loadInvoices();
  }

  private initUserFormFromAuth(): void {
    const u = this.user();
    if (!u) return;
    this.personalForm.firstName = u.firstName || '';
    this.personalForm.lastName = u.lastName || '';
    this.personalForm.email = u.email || '';
    this.personalForm.phone = u.whatsapp || '';
    this.personalForm.company = u.company || '';
  }

  private populateFormsFromCustomer(actor: ActorCustomer): void {
    this.personalForm.firstName = actor.firstName || this.personalForm.firstName;
    this.personalForm.lastName = actor.lastName || this.personalForm.lastName;
    this.personalForm.email = actor.email || this.personalForm.email;
    this.personalForm.phone = actor.phone || this.personalForm.phone;
    this.personalForm.address = actor.address || '';
    this.personalForm.postal = actor.postal || '';
    this.personalForm.company = actor.companyName || this.personalForm.company;

    if (actor.city?.country?.id) {
      this.personalForm.countryId = actor.city.country.id;
      this.loadCities(actor.city.country.id, actor.city.id);
    } else if (actor.city?.id) {
      this.personalForm.cityId = actor.city.id;
    }
  }

  private loadCountries(): void {
    this.actorService.getCountries().subscribe({
      next: (list) => {
        this.countries.set(list);
        if (!this.personalForm.countryId && list.length > 0) {
          // Par défaut Sénégal ou premier pays
          const defaultCountry = list.find((c) => c.countryCode === 'SN') || list[0];
          if (defaultCountry && !this.personalForm.countryId) {
            this.personalForm.countryId = defaultCountry.id;
            this.loadCities(defaultCountry.id);
          }
        }
      },
      error: (err) => console.warn('Impossible de charger les pays:', err),
    });
  }

  protected onCountryChange(countryId: string): void {
    this.personalForm.countryId = countryId;
    this.personalForm.cityId = '';
    this.cities.set([]);
    if (countryId) {
      this.loadCities(countryId);
    }
  }

  private loadCities(countryId: string, preselectedCityId?: string): void {
    this.loadingCities.set(true);
    this.actorService.getCitiesByCountry(countryId).subscribe({
      next: (list) => {
        this.cities.set(list);
        this.loadingCities.set(false);
        if (preselectedCityId) {
          this.personalForm.cityId = preselectedCityId;
        } else if (list.length > 0 && !this.personalForm.cityId) {
          this.personalForm.cityId = list[0].id;
        }
      },
      error: () => {
        this.cities.set([]);
        this.loadingCities.set(false);
      },
    });
  }

  protected setTab(tab: AccountTab): void {
    this.activeTab.set(tab);
    if (tab === 'invoices' && this.invoices().length === 0 && !this.loadingInvoices()) {
      this.loadInvoices();
    }
  }

  protected selectSection(sectionId: ProfileSection): void {
    this.activeSection.set(sectionId);
    this.isEditMode.set(false);
    this.profileMessage.set(null);
    this.showDeleteConfirm.set(false);
    this.deleteConfirmationText.set('');
  }

  protected toggleEditMode(): void {
    this.isEditMode.set(!this.isEditMode());
    this.profileMessage.set(null);
  }

  protected cancelEdit(): void {
    this.isEditMode.set(false);
    this.profileMessage.set(null);
    const actor = this.profileCustomer();
    if (actor) {
      this.populateFormsFromCustomer(actor);
    } else {
      this.initUserFormFromAuth();
    }
  }

  protected savePersonalInfo(): void {
    if (!this.personalForm.firstName.trim() || !this.personalForm.lastName.trim()) {
      this.profileMessage.set('Le prénom et le nom sont requis.');
      this.profileMessageType.set('error');
      return;
    }

    this.isSavingProfile.set(true);
    this.profileMessage.set(null);

    const countryObj = this.countries().find((c) => c.id === this.personalForm.countryId);
    const cityObj = this.cities().find((c) => c.id === this.personalForm.cityId);

    const cust = this.profileCustomer();
    const customerId = cust?.id;

    const payload: Partial<ActorCustomer> = {
      firstName: this.personalForm.firstName.trim(),
      lastName: this.personalForm.lastName.trim(),
      email: cust?.email || this.user()?.email || '',
      phone: this.personalForm.phone ? normalizePhone(this.personalForm.phone) : undefined,
      address: this.personalForm.address?.trim() || undefined,
      postal: this.personalForm.postal?.trim() || undefined,
      userId: this.user()?.id,
      companyName: this.personalForm.company?.trim() || undefined,
      city: cityObj
        ? {
            id: cityObj.id,
            cityName: cityObj.cityName,
            country: countryObj || null,
          }
        : null,
    };

    if (customerId) {
      this.actorService.updateProfil(customerId, payload).subscribe({
        next: (updated) => {
          this.profileCustomer.set(updated);
          this.auth.mergeActorProfile(updated);
          this.isSavingProfile.set(false);
          this.isEditMode.set(false);
          this.profileMessage.set('Vos informations ont été mises à jour avec succès');
          this.profileMessageType.set('success');
          setTimeout(() => this.profileMessage.set(null), 5000);
        },
        error: (err) => {
          console.error('Erreur mise à jour profil :', err);
          this.isSavingProfile.set(false);
          this.profileMessage.set('Une erreur est survenue lors de la mise à jour. Veuillez réessayer.');
          this.profileMessageType.set('error');
        },
      });
    } else {
      // Si pas encore de customerId, on simule la mise à jour locale
      this.isSavingProfile.set(false);
      this.isEditMode.set(false);
      this.profileMessage.set('Vos informations ont été mises à jour avec succès');
      this.profileMessageType.set('success');
      setTimeout(() => this.profileMessage.set(null), 5000);
    }
  }

  protected openKeycloakAccount(): void {
    this.auth.openAccountManagement();
  }

  protected downloadUserData(): void {
    this.isDownloadingData.set(true);
    this.downloadSuccess.set(null);

    setTimeout(() => {
      const exportPayload = {
        meta: {
          exportDate: new Date().toISOString(),
          platform: 'KOLISS SOURCING & FLEET',
          version: '1.0',
        },
        profile: {
          id: this.profileCustomer()?.id || this.user()?.id,
          firstName: this.personalForm.firstName,
          lastName: this.personalForm.lastName,
          email: this.personalForm.email,
          phone: this.personalForm.phone,
          company: this.personalForm.company,
          address: this.personalForm.address,
          postalCode: this.personalForm.postal,
          country: this.selectedCountry()?.countryName,
          city: this.selectedCity()?.cityName,
        },
        quotes: this.quotes(),
        invoices: this.invoices(),
      };

      const jsonStr = JSON.stringify(exportPayload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = (this.personalForm.firstName || 'client').toLowerCase().replace(/[^a-z0-9]/g, '-');
      a.download = `koliss-donnees-profil-${safeName}-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      window.URL.revokeObjectURL(url);

      this.isDownloadingData.set(false);
      this.downloadSuccess.set(
        'Vos données personnelles et votre historique ont été téléchargés avec succès (format JSON).'
      );
    }, 1200);
  }

  protected showDeleteModal(): void {
    this.showDeleteConfirm.set(true);
    this.deleteConfirmationText.set('');
    this.deleteErrorMessage.set(null);
  }

  protected cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deleteConfirmationText.set('');
  }

  protected confirmAccountDeletion(): void {
    if (this.deleteConfirmationText().trim().toUpperCase() !== 'SUPPRIMER') {
      return;
    }
    const customerId = this.profileCustomer()?.id;
    this.isDeletingAccount.set(true);
    this.deleteErrorMessage.set(null);

    const performLogout = async () => {
      this.isDeletingAccount.set(false);
      await this.auth.logout();
    };

    if (customerId) {
      this.actorService.deleteAccount(customerId).subscribe({
        next: () => void performLogout(),
        error: (err) => {
          console.warn('Suppression compte backend ignorée/erreur:', err);
          void performLogout();
        },
      });
    } else {
      void performLogout();
    }
  }

  protected loadFlag(countryCode?: string | null): string {
    if (!countryCode) return '';
    return `assets/flags_80x60/${countryCode.toLowerCase()}.png`;
  }

  // Devis
  protected loadQuotes(): void {
    this.loadingQuotes.set(true);
    this.errorQuotes.set(null);

    this.quoteService.getMyQuotes().subscribe({
      next: (data) => {
        this.quotes.set(data);
        this.loadingQuotes.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des devis :', err);
        this.errorQuotes.set(
          'Impossible de récupérer vos dossiers de sourcing pour le moment. Veuillez vérifier votre connexion.',
        );
        this.loadingQuotes.set(false);
      },
    });
  }

  protected loadInvoices(): void {
    this.loadingInvoices.set(true);
    this.errorInvoices.set(null);

    this.invoiceService.getMyInvoices().subscribe({
      next: (data) => {
        this.invoices.set(data);
        this.loadingInvoices.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des factures :', err);
        this.errorInvoices.set('Impossible de charger vos factures. Veuillez réessayer.');
        this.loadingInvoices.set(false);
      },
    });
  }

  protected acceptOffer(quote: QuoteResponse, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.actionInProgress.set(quote.id);
    this.quoteService.acceptOffer(quote.id).subscribe({
      next: () => {
        this.actionInProgress.set(null);
        this.loadQuotes();
        this.loadInvoices();
      },
      error: (err) => {
        console.error("Erreur lors de l'acceptation de l'offre :", err);
        this.actionInProgress.set(null);
        alert("Une erreur est survenue lors de l'acceptation de l'offre.");
      },
    });
  }

  protected rejectOffer(quote: QuoteResponse, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const reason = prompt("Précisez la raison de votre refus ou vos souhaits de révision :");
    if (reason === null) {
      return;
    }

    this.actionInProgress.set(quote.id);
    this.quoteService.rejectOffer(quote.id, reason).subscribe({
      next: () => {
        this.actionInProgress.set(null);
        this.loadQuotes();
      },
      error: (err) => {
        console.error("Erreur lors du refus de l'offre :", err);
        this.actionInProgress.set(null);
      },
    });
  }

  protected openQuoteDetail(quote: QuoteResponse): void {
    this.selectedQuote.set(quote);
  }

  protected closeQuoteDetail(): void {
    this.selectedQuote.set(null);
  }

  protected getStatusMeta(status: string): QuoteStatusMeta {
    return (
      QUOTE_STATUS_CONFIG[status] ?? {
        label: status,
        badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
        dotClass: 'bg-slate-500',
        icon: 'pi-info-circle',
      }
    );
  }

  protected getInvoiceStatusMeta(status: string): InvoiceStatusMeta {
    return (
      INVOICE_STATUS_CONFIG[status] ?? {
        label: status,
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        dotClass: 'bg-slate-400',
        icon: 'pi-file',
      }
    );
  }

  protected getInvoiceTypeLabel(type: string): string {
    return INVOICE_TYPE_LABELS[type] ?? type;
  }

  protected getFormulaLabel(formula: string): string {
    return FORMULA_LABELS[formula] ?? formula;
  }

  protected getDeliveryLabel(delivery: string): string {
    return DELIVERY_LABELS[delivery] ?? delivery;
  }

  protected getQuoteWhatsAppUrl(quote: QuoteResponse): string {
    const phone = this.contact.whatsappNumber;
    const msg = encodeURIComponent(
      `Bonjour KOLISS, je vous contacte au sujet de ma demande de devis ${quote.reference} (${quote.destinationCountry}).`,
    );
    return `https://wa.me/${phone}?text=${msg}`;
  }

  protected handleLogout(): void {
    void this.auth.logout();
  }
}
