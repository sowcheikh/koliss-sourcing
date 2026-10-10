const NUMBER_FORMAT = new Intl.NumberFormat('fr-FR');

/** Nombre au format français (espace comme séparateur de milliers). */
export function formatNumber(value: number): string {
  return NUMBER_FORMAT.format(value);
}

/** Montant en euros au format de la maquette : `4 200€`. */
export function formatPrice(value: number): string {
  return `${formatNumber(value)}€`;
}
