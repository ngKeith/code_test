import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { authStateSelector } from 'src/app/store/app_and_auth/selectors/auth.selectors';
import { AuthState } from 'src/app/store/app_and_auth/app.state';
import { take, switchMap } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    return this.store.select(authStateSelector).pipe(
      take(1),
      switchMap((authState: AuthState) => {
        if (authState.isLoggedIn && authState.token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${authState.token}`,
            },
          });
        }

        return next.handle(request);
      })
    );
  }
}
