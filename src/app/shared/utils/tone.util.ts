import { CategoryTone } from '../models/category.model';

/**
 * Classes Tailwind (fond + couleur d'icône) par teinte de catégorie.
 * Les noms de classes sont écrits en toutes lettres pour être détectés par Tailwind.
 */
export const TONE_CLASSES: Readonly<Record<CategoryTone, string>> = {
  sun: 'bg-koliss-secondary-soft text-koliss-warning-dark',
  green: 'bg-green-50 text-koliss-success-dark',
  blue: 'bg-blue-50 text-koliss-info-dark',
  orange: 'bg-orange-50 text-koliss-warning-dark',
  violet: 'bg-violet-50 text-violet-700',
  slate: 'bg-slate-100 text-koliss-primary',
};
