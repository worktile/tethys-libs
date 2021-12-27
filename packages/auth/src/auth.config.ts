import { InjectionToken } from '@angular/core';
import { ThyAuthConfig } from './interface';

export const DEFAULT_CONFIG: ThyAuthConfig = {
    tokenStoreKey: '_token',
    tokenInvalidRedirect: true,
    tokenExpOffset: 10,
    loginUrl: '/login',
    referrerKey: 'redirect_uri',
    ignores: [/\/login/, /assets\//, /passport\//],
    refreshTime: 3000,
    refreshOffset: 6000
};

export function mergeConfig(config?: ThyAuthConfig): ThyAuthConfig {
    return Object.assign(DEFAULT_CONFIG, config);
}

export const THY_AUTH_CONFIG = new InjectionToken<ThyAuthConfig>('THY_AUTH_CONFIG');
