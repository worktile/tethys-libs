import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import localeZH from '@angular/common/locales/zh';
import { ThyIconRegistry } from 'ngx-tethys/icon';
import { THY_FORM_CONFIG } from 'ngx-tethys/form';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared';
import { registerLocaleData } from '@angular/common';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { withInterceptorsFromDi, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authJWTInterceptor, ThyAuthModule } from '@tethys/auth';
import { UserModule } from './features/user/user.module';
import { THY_SITE_SETTINGS } from '@tethys/pro/core';
import { DEFAULT_GLOBAL_SETTING } from './config/setting';

registerLocaleData(localeZH);

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        CoreModule,
        LayoutModule,

        SharedModule,
        UserModule,
        ThyAuthModule.forRoot({
            loginUrl: '/passport/login',
            tokenStoreKey: 'demo_token'
        })
    ],
    providers: [
        {
            provide: THY_FORM_CONFIG,
            useValue: {
                layout: 'vertical',
                footerAlign: 'left'
            }
        },
        provideHttpClient(withInterceptors([authJWTInterceptor]), withInterceptorsFromDi()),
        {
            provide: THY_SITE_SETTINGS,
            useValue: DEFAULT_GLOBAL_SETTING
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(iconRegistry: ThyIconRegistry, sanitizer: DomSanitizer) {
        const iconSvgUrl = 'assets/icons/defs/svg/sprite.defs.svg';
        iconRegistry.addSvgIconSet(sanitizer.bypassSecurityTrustResourceUrl(iconSvgUrl));
    }
}
