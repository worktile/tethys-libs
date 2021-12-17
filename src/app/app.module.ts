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
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AUTH_CONFIG, JWTInterceptor } from '@tethys/auth';

registerLocaleData(localeZH);

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, CoreModule, LayoutModule, SharedModule],
    providers: [
        {
            provide: THY_FORM_CONFIG,
            useValue: {
                layout: 'vertical',
                footerAlign: 'left'
            }
        },
        {   provide: HTTP_INTERCEPTORS, 
            useClass: JWTInterceptor, 
            multi: true 
        },
        {
            provide: AUTH_CONFIG,
            useValue: {
                storeKey: 'demo_token'
            }
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
