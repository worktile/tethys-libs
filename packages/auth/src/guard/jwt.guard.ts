import { inject, Injectable, Injector } from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    CanLoad,
    Route,
    UrlSegment,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanMatch,
    GuardResult,
    MaybeAsync
} from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { ThyAuthService } from '../auth.service';
import { ThyAuthConfig } from '../auth.config';
import { ThyTokenService } from '../token/token.service';
import { redirectToLogin } from '../utils';

@Injectable()
export class ThyAuthJWTGuard implements CanActivate, CanActivateChild, CanMatch {
    private url: string | undefined;

    private tokenService = inject(ThyTokenService);

    private injector = inject(Injector);

    constructor() {}

    private get config(): ThyAuthConfig {
        return this.tokenService.options;
    }

    private isAuthenticated(): Observable<boolean> {
        const authenticated = this.authService.isAuthenticated();
        if (!authenticated) {
            redirectToLogin(this.config, this.injector, this.url);
        }
        return of(authenticated);
    }

    // lazy loading
    canLoad(route: Route, _segments: UrlSegment[]): Observable<boolean> {
        this.url = route.path;
        return this.isAuthenticated();
    }

    canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
        this.url = route.path;
        return this.isAuthenticated();
    }

    // all children route
    canActivateChild(_childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        this.url = state.url;
        return this.isAuthenticated();
    }

    // route
    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        this.url = state.url;
        return this.isAuthenticated();
    }

    protected get authService(): ThyAuthService {
        return this.injector.get(ThyAuthService);
    }
}
