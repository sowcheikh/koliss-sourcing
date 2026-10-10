import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CONTACT, SITE_NAME, SOCIAL_LINKS, WHATSAPP_URL } from '../../../core/config/site.config';
import { CATEGORIES } from '../../../core/data/categories.data';

/** Pied de page : marque, réseaux sociaux, catégories, services, contact et liens légaux. */
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly siteName = SITE_NAME;
  protected readonly contact = CONTACT;
  protected readonly whatsappUrl = WHATSAPP_URL;
  protected readonly socials = SOCIAL_LINKS;
  /** Les 5 premières catégories (comme dans la maquette). */
  protected readonly categories = CATEGORIES.slice(0, 5);
  protected readonly services = [
    'Sourcing standard',
    'Sourcing premium',
    'OEM & marque propre',
    'Contrôle qualité',
    'Consolidation colis',
  ];
  protected readonly year = new Date().getFullYear();
}
