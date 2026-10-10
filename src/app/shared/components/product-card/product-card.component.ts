import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { findCategory } from '../../../core/data/categories.data';
import { Product } from '../../models/product.model';
import { formatPrice } from '../../utils/format.util';
import { getMoq, getStartingPrice, pluralizeUnit } from '../../utils/pricing.util';
import { TONE_CLASSES } from '../../utils/tone.util';
import { ButtonComponent } from '../button/button.component';

/** Carte produit (grille d'accueil et boutique). `layout="list"` : présentation horizontale. */
@Component({
  selector: 'app-product-card',
  imports: [RouterLink, ButtonComponent],
  templateUrl: './product-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly layout = input<'grid' | 'list'>('grid');

  protected readonly category = computed(() => findCategory(this.product().category));
  protected readonly toneClasses = computed(() => TONE_CLASSES[this.category()?.tone ?? 'slate']);
  protected readonly moq = computed(() => getMoq(this.product()));
  protected readonly moqLabel = computed(
    () => `MOQ ${this.moq()} ${this.moq() === 1 ? 'unité' : 'unités'}`,
  );
  protected readonly priceLabel = computed(() => formatPrice(getStartingPrice(this.product())));
  protected readonly unitLabel = computed(() => pluralizeUnit(this.product().unit, 1));
}
