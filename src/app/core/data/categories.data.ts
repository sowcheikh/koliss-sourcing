import { Category, CategoryId } from '../../shared/models/category.model';

/** Catégories du catalogue (ordre d'affichage de la maquette). */
export const CATEGORIES: readonly Category[] = [
  {
    id: 'solaire',
    label: 'Énergie Solaire',
    shortLabel: 'Énergie Solaire',
    icon: 'pi-sun',
    tone: 'sun',
    description: 'Panneaux, batteries, onduleurs, kits autonomes',
  },
  {
    id: 'machines',
    label: 'Machines Industrielles',
    shortLabel: 'Machines',
    icon: 'pi-cog',
    tone: 'green',
    description: 'Transformateurs, presses, découpes, compresseurs',
  },
  {
    id: 'agricole',
    label: 'Matériel Agricole',
    shortLabel: 'Matériel Agricole',
    icon: 'pi-apple',
    tone: 'green',
    description: 'Pompes, irrigateurs, motoculteurs, silos',
  },
  {
    id: 'btp',
    label: 'BTP & Construction',
    shortLabel: 'BTP',
    icon: 'pi-hammer',
    tone: 'orange',
    description: 'Ciment, tuiles, câbles, sanitaires, outillage',
  },
  {
    id: 'medical',
    label: 'Équipement Médical',
    shortLabel: 'Médical',
    icon: 'pi-heart',
    tone: 'blue',
    description: 'Lits, fauteuils, diagnostic, consommables',
  },
  {
    id: 'chimique',
    label: 'Produits Chimiques',
    shortLabel: 'Chimique',
    icon: 'pi-sparkles',
    tone: 'violet',
    description: 'Engrais, produits de traitement, désinfectants',
  },
  {
    id: 'eau',
    label: 'Eau & Irrigation',
    shortLabel: 'Eau',
    icon: 'pi-cloud',
    tone: 'blue',
  },
  {
    id: 'alim',
    label: 'Transformation Alimentaire',
    shortLabel: 'Agroalim.',
    icon: 'pi-warehouse',
    tone: 'green',
  },
  {
    id: 'engins',
    label: 'Engins & Véhicules',
    shortLabel: 'Engins',
    icon: 'pi-truck',
    tone: 'slate',
  },
];

export function findCategory(id: CategoryId | string | null | undefined): Category | undefined {
  return CATEGORIES.find((category) => category.id === id);
}
