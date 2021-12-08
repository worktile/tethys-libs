import { Inject, Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthConfig, AuthTokenService, AUTH_SERVICE_TOKEN } from '../../interface';
import { CheckJwt, ToLogin } from '../helper';
import { JWTTokenModel } from './jwt.model';

@Injectable({ providedIn: 'root' })
export class JWTGuard implements CanActivate, CanActivateChild, CanLoad {
  private url: string | undefined;

  constructor(@Inject(AUTH_SERVICE_TOKEN) private srv: AuthTokenService, private injector: Injector) {}

  private get cog(): AuthConfig {
    return this.srv.options;
  }

  private process(): boolean {
    const res = CheckJwt(this.srv.get<JWTTokenModel>(JWTTokenModel), this.cog.token_exp_offset!);
    if (!res) {
      ToLogin(this.cog, this.injector, this.url);
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
