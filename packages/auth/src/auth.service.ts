import { Inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { SafeAny } from './types';
import { ThyAuthToken, ThyAuthTokenClass } from './token/token';
import { THY_AUTH_FALLBACK_TOKEN } from './token/token-storage.service';
import { ThyTokenService } from './token/token.service';
import { createToken } from './utils';

@Injectable()
export class ThyAuthService {
    constructor(protected tokenService: ThyTokenService, @Inject(THY_AUTH_FALLBACK_TOKEN) private fallbackClass: ThyAuthTokenClass) {}

    /**
     * Retrieves current authenticated token stored
     * @returns {Observable<any>}
     */
    getToken(): Observable<ThyAuthToken> {
        return this.tokenService.get();
    }

    /**
     * Returns true if auth token is present in the token storage
     * @returns {Observable<boolean>}
     */
    isAuthenticated(): Observable<boolean> {
        return this.getToken().pipe(
            map((token: ThyAuthToken) => {
                return (token.isValid && token.isValid()) || false;
            })
        );
    }

    setToken(token: ThyAuthToken<string>) {
        if (token) {
            return this.tokenService.set(token!).pipe(
                map(() => {
                    return token;
                })
            );
        }
        return of(token);
    }

    authenticate(token: string): Observable<SafeAny> {
        return this.processResultToken(token);
    }

    private processResultToken(token: string) {
        const processToken = createToken(this.fallbackClass, token);
        if (processToken.getValue()) {
            return this.tokenService.set(processToken).pipe(
                map(() => {
                    return processToken;
                })
            );
        }
        return of(processToken);
    }

    /**
     * Returns tokens stream
     */
    onTokenChange(): Observable<ThyAuthToken | null> {
        return this.tokenService.tokenChange();
    }

    /**
     * Returns authentication status stream
     */
    onAuthenticationChange(): Observable<boolean> {
        return this.onTokenChange().pipe(map((token: ThyAuthToken | null) => token!.isValid()));
    }
}
