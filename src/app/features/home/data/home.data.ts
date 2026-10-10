import { Benefit, HeroStat, ProcessStep, Testimonial } from '../models/home.model';

export const HERO_STATS: readonly HeroStat[] = [
  { value: '2 400+', label: 'Produits référencés' },
  { value: '-40%', label: 'vs prix marché local' },
  { value: '12j', label: 'Délai moyen livraison' },
  { value: '98%', label: 'Satisfaction client' },
];

export const HOME_STEPS: readonly ProcessStep[] = [
  {
    icon: 'pi-file-edit',
    title: 'Envoyez votre liste',
    description:
      'Décrivez vos produits, quantités et destination via notre formulaire de devis ou sur WhatsApp.',
  },
  {
    icon: 'pi-search',
    title: 'Votre agent sourcing',
    description:
      'Notre agent francophone identifie les meilleurs fournisseurs et négocie les prix pour vous.',
  },
  {
    icon: 'pi-check-circle',
    title: 'Contrôle qualité',
    description:
      "Inspection des produits avec photos avant expédition. Zéro mauvaise surprise à l'arrivée.",
  },
  {
    icon: 'pi-send',
    title: 'Livraison chez vous',
    description:
      "Expédition par voie aérienne ou maritime avec suivi en temps réel jusqu'à votre destination.",
  },
];

export const WHY_BENEFITS: readonly Benefit[] = [
  {
    icon: 'pi-globe',
    tone: 'sun',
    title: "Présence locale en Afrique de l'Ouest",
    description:
      'Équipes à Dakar, Bamako et Abidjan. Votre agent parle votre langue et comprend votre marché.',
  },
  {
    icon: 'pi-warehouse',
    tone: 'green',
    title: 'Accès direct aux usines chinoises',
    description:
      'Partenaires certifiés à Guangzhou, Shenzhen, Yiwu et Hangzhou. Prix fabricant sans intermédiaire.',
  },
  {
    icon: 'pi-box',
    tone: 'slate',
    title: 'Consolidation de commandes',
    description:
      'Regroupez vos achats de plusieurs fournisseurs en un seul envoi. Économisez sur le fret.',
  },
];

export const WHY_FEATURES: readonly Benefit[] = [
  {
    icon: 'pi-lock',
    tone: 'glass',
    title: 'Paiement sécurisé & escrow',
    description:
      'Votre argent est protégé. Libéré au fournisseur uniquement après validation de la conformité.',
  },
  {
    icon: 'pi-camera',
    tone: 'glass',
    title: 'Contrôle qualité avec photos',
    description: 'Inspection visuelle complète avant expédition. Rapport photos envoyé sur WhatsApp.',
  },
  {
    icon: 'pi-palette',
    tone: 'glass',
    title: 'Personnalisation & OEM',
    description: 'Logo, packaging, étiquettes personnalisées. Construisez votre propre marque.',
  },
  {
    icon: 'pi-send',
    tone: 'glass',
    title: 'Livraison express disponible',
    description: 'Option DHL/FedEx pour les urgences. Livraison aérienne en 5–7 jours ouvrables.',
  },
];

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    initials: 'MT',
    avatarClass: 'bg-koliss-primary text-white',
    quote:
      "J'importais avant via Alibaba avec des soucis constants de qualité. Avec KOLISS Sourcing, j'ai un agent qui négocie pour moi et mes panneaux solaires arrivent à Dakar en 12 jours.",
    name: 'Mamadou Traoré',
    role: 'Distributeur énergie solaire, Dakar',
  },
  {
    initials: 'FK',
    avatarClass: 'bg-koliss-success text-white',
    quote:
      "Mon agent parle français, répond sur WhatsApp le soir, et m'a trouvé des machines de transformation 40% moins chères que mon prestataire précédent. Service exceptionnel.",
    name: 'Fatoumata Kouyaté',
    role: 'Agroalimentaire, Bamako',
  },
  {
    initials: 'IS',
    avatarClass: 'bg-koliss-info text-white',
    quote:
      "KOLISS a vérifié nos équipements médicaux avant l'expédition, fait des photos, et nous a remboursé deux articles non conformes. Un vrai partenaire de confiance.",
    name: 'Ibrahim Sangaré',
    role: 'Directeur clinique, Abidjan',
  },
];
