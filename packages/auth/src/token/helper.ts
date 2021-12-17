import { DOCUMENT } from '@angular/common';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig } from '../interface';
import { JWTTokenModel } from './jwt/jwt.model';

export function redirectToLogin(options: AuthConfig, injector: Injector, url?: string): void {
    const router = injector.get<Router>(Router);
    if (options.tokenInvalidRedirect === true) {
        setTimeout(() => {
            const loginUrl = `${options.loginUrl}?${options.referrerKey}=${url || router.url}`;
            if (/^https?:\/\//g.test(options.loginUrl!)) {
                injector.get(DOCUMENT).location.href = loginUrl;
            } else {
                router.navigateByUrl(loginUrl);
            }
        });
    }
}

export function checkJwt(model: JWTTokenModel, offset: number): boolean {
    try {
        return model != null && !!model.token && !model.isExpired(offset);
    } catch (err: any) {
        console.warn(`${err.message}, jump to login_url`);
        return false;
    }
}
