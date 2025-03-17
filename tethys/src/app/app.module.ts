import { inject, NgModule, provideAppInitializer } from '@angular/core';
import { DomSanitizer, BrowserModule } from '@angular/platform-browser';
import { THY_SITE_SETTINGS, ThySiteSettings } from '@tethys/pro/core';
import { ThyProLayoutModule } from '@tethys/pro/layout';
import { ThyActionModule } from 'ngx-tethys/action';
import { ThyAvatarModule } from 'ngx-tethys/avatar';
import { ThyIconRegistry } from 'ngx-tethys/icon';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { ThyMenuModule } from 'ngx-tethys/menu';
import { ThyNotifyModule } from 'ngx-tethys/notify';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DocgeniTemplateModule } from '@docgeni/template';
import { DOCGENI_SITE_PROVIDERS } from './content/index';
import { RootComponent } from './content/index';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThyI18nService } from '@tethys/pro/i18n';

const TETHYS_MODULES = [
    ThyLayoutModule,
    ThyMenuModule,
    ThyNotifyModule,
    ThyPopoverModule,
    ThyActionModule,
    ThyAvatarModule,
    ThyTooltipModule,
    ThyProLayoutModule
];

export const DEFAULT_GLOBAL_SETTING: ThySiteSettings = {
    theme: 'light',
    primaryColor: '#6698ff',
    layout: 'side',
    showHeader: true,
    showFooter: true,
    fixSiderbar: true,
    fixedHeader: true,
    splitMenu: false
};

function initializeApp(iconRegistry: ThyIconRegistry, sanitizer: DomSanitizer) {
    return () => {
        return new Promise((resolve, reject) => {
            const iconSvgUrl = 'assets/icons/defs/svg/sprite.defs.svg';
            iconRegistry.addSvgIconSet(sanitizer.bypassSecurityTrustResourceUrl(iconSvgUrl));
            resolve(null);
        });
    };
}
@NgModule({
    declarations: [],
    providers: [
        provideAppInitializer(() => {
            const initializerFn = initializeApp(inject(ThyIconRegistry), inject(DomSanitizer));
            return initializerFn();
        }),
        {
            provide: THY_SITE_SETTINGS,
            useValue: DEFAULT_GLOBAL_SETTING
        },
        ...DOCGENI_SITE_PROVIDERS
    ],
    imports: [...TETHYS_MODULES, BrowserModule, BrowserAnimationsModule, DocgeniTemplateModule, RouterModule.forRoot([])],
    exports: [],
    bootstrap: [RootComponent]
})
export class AppModule {
    router = inject(Router);

    takeUntilDestroyed = takeUntilDestroyed();

    i18nService = inject(ThyI18nService);

    constructor() {
        this.router.events.pipe(this.takeUntilDestroyed).subscribe((event) => {
            if (event instanceof NavigationEnd) {
                let localeId = this.router.url.split('/')[1];
                this.i18nService.setLocale(localeId);
            }
        });
    }
}
