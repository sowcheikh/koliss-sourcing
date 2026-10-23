import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  output,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import {
  DELIVERY_LABELS,
  FORMULA_LABELS,
  QUOTE_STATUS_CONFIG,
  QuoteResponse,
  QuoteStatusMeta,
} from '../../../../shared/models/quote.model';
import { CONTACT } from '../../../../core/config/site.config';

@Component({
  selector: 'app-quote-detail-dialog',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './quote-detail-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteDetailDialogComponent {
  readonly quote = input.required<QuoteResponse>();
  readonly closed = output<void>();

  protected readonly contact = CONTACT;

  protected readonly statusMeta = computed<QuoteStatusMeta>(() => {
    const s = this.quote().status;
    return (
      QUOTE_STATUS_CONFIG[s] ?? {
        label: s,
        badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
        dotClass: 'bg-slate-500',
        icon: 'pi-info-circle',
      }
    );
  });

  protected readonly formulaLabel = computed(() => {
    const f = this.quote().formula;
    return FORMULA_LABELS[f] ?? f;
  });

  protected readonly deliveryLabel = computed(() => {
    const d = this.quote().deliveryMode;
    return DELIVERY_LABELS[d] ?? d;
  });

  protected readonly whatsappChatUrl = computed(() => {
    const q = this.quote();
    const phone = this.contact.whatsappNumber;
    const msg = encodeURIComponent(
      `Bonjour KOLISS, je vous contacte concernant ma demande de devis de sourcing référence ${q.reference} (${q.destinationCountry}).`,
    );
    return `https://wa.me/${phone}?text=${msg}`;
  });

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.close();
  }

  protected close(): void {
    this.closed.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
