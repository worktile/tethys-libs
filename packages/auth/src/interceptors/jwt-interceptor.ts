import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import { Observable, Observer, switchMap } from 'rxjs';
import { mergeConfig, ThyAuthConfig } from '../auth.config';
import { ThyAuthService } from '../auth.service';
import { ThyAuthToken } from '../token/token';
import { ThyTokenService } from '../token/token.service';
import { SafeAny } from '../types';
import { redirectToLogin } from '../utils';
import { ALLOW_ANONYMOUS } from '../http-context-token';

export function isAnonymous(req: HttpRequest<unknown>, options: ThyAuthConfig): boolean {
    if (req.context.get(ALLOW_ANONYMOUS)) {
        return true;
    }
    if (Array.isArray(options.ignores)) {
        for (const item of options.ignores) {
            if (item.test(req.url)) return true;
        }
    }
    return false;
}

export const authJWTInterceptor: HttpInterceptorFn = (req, next) => {
    const options = mergeConfig(inject(ThyTokenService).options);
    if (isAnonymous(req, options)) return next(req);

    const authService = inject(ThyAuthService);

    if (authService.isAuthenticated()) {
        return next(authService.cloneReqWithBearerAuthorization(req));
    } else {
        redirectToLogin(options, inject(Injector));
        const err$ = new Observable((observer: Observer<HttpEvent<SafeAny>>) => {
            const res = new HttpErrorResponse({
                url: req.url,
                headers: req.headers,
                status: 401,
                statusText: '所请求URL未授权'
            });
            observer.error(res);
        });
        return err$;
    }
};
