import { Inject, Injectable, InjectionToken } from '@angular/core';
import { SafeAny } from '../types';
import { ThyAuthToken, ThyAuthTokenClass } from '../token/token';

export abstract class ThyTokenStorage {
    abstract get(key: string): ThyAuthToken;
    abstract set(key: string, value: ThyAuthToken): boolean;
    abstract clear(key: string): void;
}

export const THY_AUTH_FALLBACK_TOKEN = new InjectionToken<ThyAuthTokenClass>('Auth Options');

@Injectable()
export class ThyTokenLocalStorage extends ThyTokenStorage {
    constructor(@Inject(THY_AUTH_FALLBACK_TOKEN) private fallbackClass: ThyAuthTokenClass) {
        super();
    }

    get(key: string): ThyAuthToken {
        let tokenClass: ThyAuthTokenClass = this.fallbackClass;
        let tokenValue = '';
        let tokenCreatedAt: Date | null = null;

        const tokenPack = this.parseTokenPack(localStorage.getItem(key));
        if (tokenPack) {
            tokenClass = this.fallbackClass;
            tokenValue = tokenPack.token;
            tokenCreatedAt = new Date(Number(tokenPack.createdAt));
        }

        return new tokenClass(tokenValue, tokenCreatedAt);
    }

    set(key: string, value: ThyAuthToken | null): boolean {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    }

    clear(key: string): void {
        localStorage.removeItem(key);
    }

    protected parseTokenPack(value: SafeAny) {
        try {
            return JSON.parse(value);
        } catch (e) {}
        return null;
    }
}
