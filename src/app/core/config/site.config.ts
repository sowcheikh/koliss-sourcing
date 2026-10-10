/** Configuration éditoriale et contacts du site KOLISS Sourcing. */

export interface NavItem {
  readonly label: string;
  readonly route: string;
  /** `true` : l'item n'est actif que sur la route exacte. */
  readonly exact?: boolean;
}

export interface SocialLink {
  readonly label: string;
  readonly url: string;
  /** Fichier dans `assets/icons`. */
  readonly icon: string;
}

export interface SiteStat {
  readonly value: string;
  readonly label: string;
}

export const SITE_NAME = 'KOLISS Sourcing';

/**
 * Coordonnées : téléphone/WhatsApp et réseaux identiques à `colisage_front` et au hub `koliss`
 * (la maquette ne contient qu'un numéro factice) ; email dédié sourcing issu de la maquette.
 */
export const CONTACT = {
  email: 'sourcing@koliss.com',
  phone: '+221 78 786 04 04',
  phoneTel: '+221787860404',
  whatsappNumber: '221787860404',
  city: 'Dakar, Sénégal',
  hours: 'Lun–Sam · 8h–20h (GMT)',
  whatsappResponse: 'Réponse garantie sous 2h · Lun–Sam 8h–20h',
} as const;

export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsappNumber}`;

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Accueil', route: '/', exact: true },
  { label: 'Boutique', route: '/boutique' },
  { label: 'Solutions', route: '/solutions' },
  { label: 'Demande de devis', route: '/devis' },
];

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: 'WhatsApp', url: WHATSAPP_URL, icon: 'whatsapp-icon.svg' },
  {
    label: 'Facebook',
    url: 'https://www.facebook.com/share/1DLRgukny2/',
    icon: 'facebook-icon.svg',
  },
  { label: 'LinkedIn', url: 'https://linkedin.com/company/koliss', icon: 'linkedin-icon.svg' },
  { label: 'TikTok', url: 'https://www.tiktok.com/@koliss9741', icon: 'tiktok-icon.svg' },
];

/** Chiffres clés marketing de la maquette (indicateurs commerciaux, pas des données catalogue). */
export const SITE_STATS: readonly SiteStat[] = [
  { value: '2400+', label: 'Références produits' },
  { value: '1200+', label: 'PME clientes actives' },
  { value: '-40%', label: "d'économies en moyenne" },
  { value: '12j', label: 'Délai de livraison moyen' },
];

/** Promesses de réassurance (bandeau sous le hero et garanties du formulaire de devis). */
export const TRUST_ITEMS: readonly { icon: string; label: string }[] = [
  { icon: 'pi-shield', label: 'Fournisseurs vérifiés' },
  { icon: 'pi-box', label: 'Contrôle qualité avant expédition' },
  { icon: 'pi-comments', label: 'Agent dédié en français' },
  { icon: 'pi-send', label: 'Livraison Asie–Afrique 10–15j' },
  { icon: 'pi-wallet', label: 'Prix fabricant garanti' },
  { icon: 'pi-refresh', label: 'Remboursement si non-conforme' },
];
