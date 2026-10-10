import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Bandeau d'appel à l'action (fond bleu KOLISS). Titre et boutons sont projetés. */
@Component({
  selector: 'app-cta-banner',
  template: `
    <section class="bg-koliss-primary-dark text-white">
      <div class="k-container py-16 text-center md:py-20">
        <h2
          class="mx-auto max-w-3xl text-3xl font-extrabold leading-tight md:text-4xl [&_em]:not-italic [&_em]:text-koliss-secondary"
        >
          <ng-content select="[appCtaTitle]" />
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-base text-white/70 md:text-lg">{{ text() }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ng-content select="[appCtaActions]" />
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaBannerComponent {
  readonly text = input.required<string>();
}
