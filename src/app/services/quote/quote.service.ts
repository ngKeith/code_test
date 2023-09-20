import { Injectable } from '@angular/core';
import { QuoteDetails, NewQuote, QrServiceProxy, QRUserDataResponse, AgentQuotesResponse } from '../../shared/service-proxies/service-proxies';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { AuthState } from '../../store/app_and_auth/app.state';
import { Store } from '@ngrx/store';
import { authStateSelector } from '../../store/app_and_auth/selectors';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  userAuthState$: Observable<AuthState>;

  constructor(
    private store: Store,
    private qrService: QrServiceProxy
  ) {

    this.userAuthState$ = this.store.select(authStateSelector);
  }

  addQuote(quote: NewQuote): Observable<QRUserDataResponse> {
    return this.qrService.addCode(quote);
  }

  getQuotes(): Observable<AgentQuotesResponse> {
    return this.userAuthState$.pipe(
      switchMap((authState: AuthState) => {
        if (authState.isLoggedIn) {
          const agentId = authState.username;
          return this.qrService.getAgentQuotes(agentId);
        } else {
          throw new Error('User not logged in');
        }
      }),
      catchError((err) => of(err))
    )
  }
}
