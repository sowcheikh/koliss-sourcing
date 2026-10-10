import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RatingComponent } from '../../../../shared/components/rating/rating.component';
import { SectionHeadingComponent } from '../../../../shared/components/section-heading/section-heading.component';
import { TESTIMONIALS } from '../../data/home.data';

/** Témoignages de clients B2B. */
@Component({
  selector: 'app-testimonials',
  imports: [RatingComponent, SectionHeadingComponent],
  template: `
    <section class="k-section !bg-koliss-bg-2">
      <div class="k-container">
        <app-section-heading align="center" tag="Témoignages">
          Ce que disent nos <em>clients B2B</em>
        </app-section-heading>
        <div class="mt-12 grid gap-6 md:grid-cols-3">
          @for (testimonial of testimonials; track testimonial.name) {
            <figure class="k-card flex flex-col p-7">
              <app-rating [value]="5" [showLabel]="false" />
              <blockquote class="mt-4 flex-1 text-[15px] leading-relaxed text-koliss-text-muted">
                « {{ testimonial.quote }} »
              </blockquote>
              <figcaption class="mt-6 flex items-center gap-3">
                <span
                  class="flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold"
                  [class]="testimonial.avatarClass"
                  aria-hidden="true"
                  >{{ testimonial.initials }}</span
                >
                <span>
                  <span class="block text-sm font-bold text-koliss-text">{{ testimonial.name }}</span>
                  <span class="block text-xs text-koliss-text-soft">{{ testimonial.role }}</span>
                </span>
              </figcaption>
            </figure>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsComponent {
  protected readonly testimonials = TESTIMONIALS;
}
