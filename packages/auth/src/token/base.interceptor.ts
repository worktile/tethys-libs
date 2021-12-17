import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Injectable, Injector, Optional } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { mergeConfig } from '../auth.config';
import { AuthConfig, AuthSafeAny} from '../interface';
import { redirectToLogin } from './helper';
import { TokenService } from './token.service';

  
@Injectable()
export abstract class BaseInterceptor implements HttpInterceptor {
    constructor(@Optional() protected injector: Injector) {}

    abstract isAuth(options: AuthConfig): boolean;

    abstract setRequestToken(req: HttpRequest<AuthSafeAny>, options: AuthConfig): HttpRequest<AuthSafeAny>;

    intercept(req: HttpRequest<AuthSafeAny>, next: HttpHandler): Observable<HttpEvent<AuthSafeAny>> {
        const options = mergeConfig(this.injector.get(TokenService).options);
        if (Array.isArray(options.ignores)) {
            for (const item of options.ignores) {
                if (item.test(req.url)) return next.handle(req);
            }
        }
        if (this.isAuth(options)) {
            req = this.setRequestToken(req, options);
        } else {
            redirectToLogin(options, this.injector);
            const err$ = new Observable((observer: Observer<HttpEvent<AuthSafeAny>>) => {
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
        return next.handle(req);
    }
}


