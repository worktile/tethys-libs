import { Inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { SafeAny } from './types';
import { ThyAuthToken, ThyAuthTokenClass } from './token/token';
import { THY_AUTH_FALLBACK_TOKEN } from './token/token-storage.service';
import { ThyTokenService } from './token/token.service';
import { createAuthToken } from './utils';

@Injectable()
export class ThyAuthService {
    constructor(
        protected tokenService: ThyTokenService,
        @Inject(THY_AUTH_FALLBACK_TOKEN) private fallbackClass: ThyAuthTokenClass
    ) {}

    /**
     * Retrieves current authenticated token stored
     * @returns {Observable<any>}
     */
    getToken(): ThyAuthToken {
        return this.tokenService.get();
    }

    /**
     * Returns true if auth token is present in the token storage
     * @returns {boolean}
     */
    isAuthenticated(): boolean {
        const token = this.getToken();
        return (token.isValid && token.isValid()) || false;
    }

    setToken(token: ThyAuthToken<string>): void {
        if (token) {
            this.tokenService.set(token!);
        }
    }

    authenticate(token: string): void {
        this.processResultToken(token);
    }

    private processResultToken(token: string) {
        const processToken = createAuthToken(this.fallbackClass, token);
        if (processToken.getValue()) {
            this.tokenService.set(processToken);
        }
        return processToken;
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
