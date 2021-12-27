import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, Observer, switchMap } from 'rxjs';
import { mergeConfig } from '../auth.config';
import { ThyAuthService } from '../auth.service';
import { ThyAuthToken } from '../token/token';
import { ThyTokenService } from '../token/token.service';
import { SafeAny } from '../types';
import { redirectToLogin } from '../utils';

@Injectable()
export class ThyAuthJWTInterceptor implements HttpInterceptor {
    constructor(
        private injector: Injector) {}

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const options = mergeConfig(this.injector.get(ThyTokenService).options);
        if (Array.isArray(options.ignores)) {
            for (const item of options.ignores) {
                if (item.test(req.url)) return next.handle(req);
            }
        }
        return this.authService.isAuthenticated().pipe(
            switchMap((authenticated) => {
                if (authenticated) {
                    return this.authService.getToken().pipe(
                        switchMap((token: ThyAuthToken) => {
                            const JWT = `Bearer ${token.getValue()}`;
                            req = req.clone({
                                setHeaders: {
                                    Authorization: JWT
                                }
                            });
                            return next.handle(req);
                        })
                    );
                } else {
                    redirectToLogin(options, this.injector);
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
            })
        );
    }

    protected get authService(): ThyAuthService {
        return this.injector.get(ThyAuthService);
    }
}
