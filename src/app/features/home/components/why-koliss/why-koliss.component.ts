import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FeatureItemComponent } from '../../../../shared/components/feature-item/feature-item.component';
import { SectionHeadingComponent } from '../../../../shared/components/section-heading/section-heading.component';
import { WHY_BENEFITS, WHY_FEATURES } from '../../data/home.data';

/** « Pourquoi KOLISS Sourcing » : avantages et panneau de garanties. */
@Component({
  selector: 'app-why-koliss',
  imports: [FeatureItemComponent, SectionHeadingComponent],
  template: `
    <section class="k-section">
      <div class="k-container grid items-center gap-12 lg:grid-cols-2">
        <div>
          <app-section-heading
            tag="Pourquoi KOLISS Sourcing"
            subtitle="Fini les arnaques, les retards et la barrière de la langue. KOLISS gère tout pour vous, de la recherche fournisseur jusqu'à la livraison à vos entrepôts."
          >
            La solution<br /><em>clé en main</em><br />pour l'Afrique
          </app-section-heading>
          <div class="mt-8 flex flex-col gap-6">
            @for (benefit of benefits; track benefit.title) {
              <app-feature-item
                [icon]="benefit.icon"
                [tone]="benefit.tone"
                [title]="benefit.title"
                [description]="benefit.description"
              />
            }
          </div>
        </div>

        <div class="relative overflow-hidden rounded-2xl bg-koliss-primary p-8 shadow-xl md:p-10">
          <div
            class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-koliss-secondary/15 blur-2xl"
            aria-hidden="true"
          ></div>
          <div class="relative flex flex-col gap-7">
            @for (feature of features; track feature.title) {
              <app-feature-item
                [dark]="true"
                [icon]="feature.icon"
                [tone]="feature.tone"
                [title]="feature.title"
                [description]="feature.description"
              />
            }
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhyKolissComponent {
  protected readonly benefits = WHY_BENEFITS;
  protected readonly features = WHY_FEATURES;
}
