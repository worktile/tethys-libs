import { Injectable, Injector } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ThyAuthService } from '../auth.service';
import { ThyAuthConfig } from '../interface';
import { ThyTokenService } from '../token/token.service';
import { redirectToLogin } from '../utils';

@Injectable()
export class ThyAuthJWTGuard implements CanActivate, CanActivateChild, CanLoad {
    private url: string | undefined;

    constructor(private tokenService: ThyTokenService, private injector: Injector) {}

    private get config(): ThyAuthConfig {
        return this.tokenService.options;
    }

    private process(): Observable<boolean> {
        const isAuthenticated = this.authService.isAuthenticated();
        isAuthenticated.subscribe((res) => {
            if (!res) {
                redirectToLogin(this.config, this.injector, this.url);
            }
            return res;
        });
        return isAuthenticated;
    }

    // lazy loading
    canLoad(route: Route, _segments: UrlSegment[]): Observable<boolean> {
        this.url = route.path;
        return this.process();
    }
    // all children route
    canActivateChild(_childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        this.url = state.url;
        return this.process();
    }
    // route
    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        this.url = state.url;
        return this.process();
    }

    protected get authService(): ThyAuthService {
        return this.injector.get(ThyAuthService);
    }
}
