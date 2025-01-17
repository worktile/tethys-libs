import { InjectionToken } from '@angular/core';
import { ThySiteSettings } from './global.entity';

export const THY_SITE_SETTINGS = new InjectionToken<ThySiteSettings>('thy-site-settings');

export const THY_DEFAULT_SITE_SETTINGS = {
    theme: 'light',
    primaryColor: '#6698ff',
    layout: 'side',
    showHeader: true,
    showFooter: true,
    fixSiderbar: true,
    fixedHeader: true,
    splitMenu: false
};

export const THY_SITE_SETTINGS_PROVIDER = {
    provide: THY_SITE_SETTINGS,
    useValue: THY_DEFAULT_SITE_SETTINGS
};
