import { APP_INITIALIZER } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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

export default {
    imports: TETHYS_MODULES,
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [ThyIconRegistry, DomSanitizer],
            multi: true
        },
        {
            provide: THY_SITE_SETTINGS,
            useValue: DEFAULT_GLOBAL_SETTING
        }
    ]
};
