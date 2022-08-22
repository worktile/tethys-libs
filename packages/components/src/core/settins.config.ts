import { InjectionToken } from '@angular/core';
import { GlobalConfig } from 'rxjs';

export const THY_SITE_SETTINGS = new InjectionToken<GlobalConfig>('thy-site-settings');

export const THY_SITE_SETTINGS_PROVIDER = {
    provide: THY_SITE_SETTINGS,
    useValue: {
        theme: 'light',
        primaryColor: '#6698ff',
        layout: 'side',
        showHeader: true,
        showFooter: true,
        fixSiderbar: true,
        fixedHeader: true,
        splitMenu: false
    }
};
