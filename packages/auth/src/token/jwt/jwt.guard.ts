import { Inject, Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthConfig, AuthTokenService } from '../../interface';
import { checkJwt, redirectToLogin } from '../helper';
import { AUTH_SERVICE_TOKEN } from '../token.service';
import { JWTTokenModel } from './jwt.model';

@Injectable({ providedIn: 'root' })
export class JWTGuard implements CanActivate, CanActivateChild, CanLoad {
    private url: string | undefined;

    constructor(@Inject(AUTH_SERVICE_TOKEN) private authTokenService: AuthTokenService, private injector: Injector) {}

    private get config(): AuthConfig {
        return this.authTokenService.options;
    }

    private process(): boolean {
        const res = checkJwt(this.authTokenService.get<JWTTokenModel>(JWTTokenModel), this.config.tokenExpOffset!);
        if (!res) {
            redirectToLogin(this.config, this.injector, this.url);
        }
        return res;
    }

    // lazy loading
    canLoad(route: Route, _segments: UrlSegment[]): boolean {
        this.url = route.path;
        return this.process();
    }
    // all children route
    canActivateChild(_childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.url = state.url;
        return this.process();
    }
    // route
    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.url = state.url;
        return this.process();
    }
}
