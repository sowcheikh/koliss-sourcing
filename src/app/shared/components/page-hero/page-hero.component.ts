import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { BreadcrumbComponent, BreadcrumbItem } from '../breadcrumb/breadcrumb.component';

/** Bandeau de titre de page (fil d'ariane + h1 + sous-titre) sur fond bleu KOLISS. */
@Component({
  selector: 'app-page-hero',
  imports: [BreadcrumbComponent],
  template: `
    <section class="bg-koliss-primary text-white">
      <div class="k-container py-10 md:py-14">
        <app-breadcrumb [items]="breadcrumb()" />
        <h1
          class="mt-5 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl [&_em]:not-italic [&_em]:text-koliss-secondary"
        >
          <ng-content />
        </h1>
        @if (subtitle()) {
          <p class="mt-3 max-w-3xl text-base text-white/70 md:text-lg">{{ subtitle() }}</p>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeroComponent {
  readonly breadcrumb = input.required<readonly BreadcrumbItem[]>();
  readonly subtitle = input<string>();
}
