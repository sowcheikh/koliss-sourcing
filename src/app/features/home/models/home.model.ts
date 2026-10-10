import { IconTone } from '../../../shared/components/icon-tile/icon-tile.component';

export interface ProcessStep {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

export interface Benefit {
  readonly icon: string;
  readonly tone: IconTone;
  readonly title: string;
  readonly description: string;
}

export interface Testimonial {
  readonly initials: string;
  readonly avatarClass: string;
  readonly quote: string;
  readonly name: string;
  readonly role: string;
}

export interface HeroStat {
  readonly value: string;
  readonly label: string;
}
