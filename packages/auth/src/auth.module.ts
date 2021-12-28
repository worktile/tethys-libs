import { HttpRequest } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SafeAny } from './types';
import { THY_AUTH_CONFIG } from './auth.config';
import { ThyAuthConfig } from './interface';
import { ThyAuthService } from './auth.service';
import { ThyTokenService } from './token/token.service';
import { ThyTokenLocalStorage, ThyTokenStorage, THY_AUTH_FALLBACK_TOKEN } from './token/token-storage.service';
import { ThyAuthJWTToken } from './token/jwt.token';
import { ThyAuthJWTGuard } from './guard/jwt.guard';

export function thyNoOpInterceptorFilter(_request: HttpRequest<SafeAny>): boolean {
    return true;
}

@NgModule({
    imports: [],
    declarations: []
})
export class ThyAuthModule {
    static forRoot(thyAuthOptions?: ThyAuthConfig): ModuleWithProviders<ThyAuthModule> {
        return {
            ngModule: ThyAuthModule,
            providers: [
                { provide: THY_AUTH_CONFIG, useValue: thyAuthOptions },
                { provide: THY_AUTH_FALLBACK_TOKEN, useValue: ThyAuthJWTToken},
                { provide: ThyTokenStorage, useClass: ThyTokenLocalStorage },
                ThyAuthService,
                ThyTokenService,
                ThyAuthJWTGuard
            ]
        };
    }
}
