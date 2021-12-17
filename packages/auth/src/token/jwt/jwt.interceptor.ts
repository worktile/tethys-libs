import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig, AuthSafeAny, AuthTokenModel } from '../../interface';
import { BaseInterceptor } from '../base.interceptor';
import { checkJwt } from '../helper';
import { AUTH_SERVICE_TOKEN } from '../token.service';
import { JWTTokenModel } from './jwt.model';

@Injectable()
export class JWTInterceptor extends BaseInterceptor {
    protected model!: AuthTokenModel;

    isAuth(options: AuthConfig): boolean {
        this.model = this.injector.get(AUTH_SERVICE_TOKEN).get<JWTTokenModel>(JWTTokenModel);
        return checkJwt(this.model as JWTTokenModel, options.tokenExpOffset!);
    }

    setRequestToken(req: HttpRequest<AuthSafeAny>, _options: AuthConfig): HttpRequest<AuthSafeAny> {
        return req.clone({
            setHeaders: {
                Authorization: `Bearer ${this.model.token}`
            }
        });
    }
}
