import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import { Observable, Observer, switchMap } from 'rxjs';
import { mergeConfig, ThyAuthConfig } from '../auth.config';
import { ThyAuthService } from '../auth.service';
import { ThyAuthToken } from '../token/token';
import { ThyTokenService } from '../token/token.service';
import { SafeAny } from '../types';
import { redirectToLogin } from '../utils';

export function isAnonymous(req: HttpRequest<unknown>, options: ThyAuthConfig): boolean {
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
    const authenticated = authService.isAuthenticated();
    if (authenticated) {
        const token = authService.getToken();
        const authorizationStr = `Bearer ${token.getValue()}`;
        const newReq = req.clone({
            setHeaders: {
                Authorization: authorizationStr
            }
        });
        return next(newReq);
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
