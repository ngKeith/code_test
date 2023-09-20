import { QuoteDetails } from 'src/app/shared/service-proxies/service-proxies';

export interface GuuidState {
  guuidDetails: QuoteDetails | null;
  guuidValidated: boolean;
  guuidVerified: boolean;
  error: string | null;
}
