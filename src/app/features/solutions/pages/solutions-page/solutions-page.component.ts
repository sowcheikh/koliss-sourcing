import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeroComponent } from '../../../../shared/components/page-hero/page-hero.component';
import { CtaBannerComponent } from '../../../../shared/components/cta-banner/cta-banner.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { BreadcrumbItem } from '../../../../shared/components/breadcrumb/breadcrumb.component';

interface SolutionOffer {
  readonly id: string;
  readonly name: string;
  readonly badge: string;
  readonly icon: string;
  readonly popular?: boolean;
  readonly description: string;
  readonly features: readonly string[];
  readonly price: string;
  readonly ctaLabel: string;
  readonly ctaVariant: 'yellow' | 'navy' | 'outline-navy' | 'white';
}

interface TimelineStep {
  readonly number: number;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly duration: string;
}

interface SectorItem {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly description: string;
  readonly categoryId: string;
}

@Component({
  selector: 'app-solutions-page',
  imports: [RouterLink, PageHeroComponent, CtaBannerComponent, ButtonComponent],
  templateUrl: './solutions-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolutionsPageComponent {
  protected readonly breadcrumb: readonly BreadcrumbItem[] = [
    { label: 'Accueil', link: '/' },
    { label: 'Solutions' },
  ];

  protected readonly offers: readonly SolutionOffer[] = [
    {
      id: 'starter',
      name: 'Sourcing à la demande',
      badge: 'Starter',
      icon: 'pi-search',
      popular: false,
      description:
        'Idéal pour les TPE et commerçants qui souhaitent tester le sourcing en Asie sans engagement. Envoyez votre liste, recevez des devis.',
      features: [
        'Recherche fournisseur gratuite',
        'Devis comparatif en 48h',
        'MOQ dès 5 unités',
        'Contrôle qualité photos inclus',
        'Assistance WhatsApp dédiée',
      ],
      price: 'Commission : 5% du montant',
      ctaLabel: 'Démarrer avec Starter →',
      ctaVariant: 'outline-navy',
    },
    {
      id: 'pro',
      name: 'Sourcing PME Pro',
      badge: 'Pro PME',
      icon: 'pi-warehouse',
      popular: true,
      description:
        'Pour les PME qui importent régulièrement. Agent dédié, accès prioritaire aux fournisseurs partenaires et optimisation logistique complète.',
      features: [
        'Agent francophone dédié 24h/7',
        'Accès à 2 400+ usines vérifiées',
        'Contrôle qualité renforcé (0% défaut)',
        'Packaging & étiquetage personnalisé',
        'Consolidation multi-fournisseurs',
        'Photographie produit professionnelle',
      ],
      price: 'Commission : 3,5% du montant',
      ctaLabel: 'Choisir la formule Pro →',
      ctaVariant: 'yellow',
    },
    {
      id: 'enterprise',
      name: 'OEM & Marque Propre',
      badge: 'Enterprise',
      icon: 'pi-briefcase',
      popular: false,
      description:
        'Pour les entreprises développant leur propre marque de produits. Développement technique, moules industriels et certification sur mesure.',
      features: [
        'Développement produit sur mesure',
        'Création de moules & prototypes',
        'Certification CE, ISO, SGS',
        'Packaging 100% personnalisé',
        'Exclusivité territoriale possible',
        'Accès direct aux usines premium',
      ],
      price: 'Sur devis personnalisé selon projet',
      ctaLabel: 'Consulter un expert OEM →',
      ctaVariant: 'outline-navy',
    },
  ];

  protected readonly timeline: readonly TimelineStep[] = [
    {
      number: 1,
      icon: 'pi-file-edit',
      title: 'Réception de votre demande',
      description:
        'Vous soumettez votre liste de produits via le formulaire en ligne ou WhatsApp. Un agent spécialisé vous est assigné immédiatement.',
      duration: '⏱ J+0 · Immédiat',
    },
    {
      number: 2,
      icon: 'pi-search',
      title: 'Recherche & négociation usine',
      description:
        'Votre agent identifie 2 à 4 fabricants certifiés, négocie les tarifs au plus bas et vous transmet un devis comparatif détaillé.',
      duration: '⏱ J+1 à J+3 · Devis sous 48h',
    },
    {
      number: 3,
      icon: 'pi-shield',
      title: 'Validation & paiement sécurisé',
      description:
        'Vous validez l’offre retenue et réglez en toute sérénité. Les fonds sont sécurisés via compte séquestre (escrow) jusqu’au contrôle final.',
      duration: '⏱ J+3 à J+5',
    },
    {
      number: 4,
      icon: 'pi-cog',
      title: 'Fabrication & contrôle qualité',
      description:
        'L’usine lance la production. Nos inspecteurs en Chine effectuent un audit rigoureux avec rapport photo et vidéo avant tout départ.',
      duration: '⏱ J+5 à J+15 selon produit',
    },
    {
      number: 5,
      icon: 'pi-send',
      title: 'Expédition & suivi en direct',
      description:
        'Marchandises embarquées en fret aérien ou conteneur maritime. Vous suivez l’acheminement pas à pas avec mises à jour quotidiennes.',
      duration: '⏱ J+10 à J+15 (aérien)',
    },
    {
      number: 6,
      icon: 'pi-check-circle',
      title: 'Livraison & garantie de conformité',
      description:
        'Réception à Dakar, Abidjan, Bamako ou Conakry. En cas de non-conformité constatée, KOLISS prend en charge le remboursement.',
      duration: '⏱ Garantie satisfaction 100%',
    },
  ];

  protected readonly sectors: readonly SectorItem[] = [
    {
      id: 'solaire',
      name: 'Énergie Solaire',
      icon: 'pi-sun',
      description: 'Panneaux monocristallins, batteries gel/lithium, onduleurs hybrides, kits autonomes.',
      categoryId: 'solaire',
    },
    {
      id: 'indus',
      name: 'Machines Industrielles',
      icon: 'pi-cog',
      description: 'Lignes de transformation, presses, machines d’emballage, compresseurs industriels.',
      categoryId: 'indus',
    },
    {
      id: 'agricole',
      name: 'Matériel Agricole',
      icon: 'pi-cloud',
      description: 'Motopompes diesel, systèmes d’irrigation goutte-à-goutte, motoculteurs, silos.',
      categoryId: 'agricole',
    },
    {
      id: 'btp',
      name: 'BTP & Construction',
      icon: 'pi-hammer',
      description: 'Matériaux de structure, tuiles métalliques, câbles électriques, outillage de chantier.',
      categoryId: 'btp',
    },
    {
      id: 'medical',
      name: 'Équipement Médical',
      icon: 'pi-heart',
      description: 'Lits médicalisés, tables d’examen, consommables hospitaliers, dispositifs de diagnostic.',
      categoryId: 'medical',
    },
    {
      id: 'chimie',
      name: 'Produits Chimiques & Intrants',
      icon: 'pi-filter',
      description: 'Engrais hydrosolubles, produits de traitement de l’eau, désinfectants industriels.',
      categoryId: 'chimie',
    },
  ];
}
