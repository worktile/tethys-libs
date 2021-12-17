import { AuthConfig } from './interface';

export const DEFAULT_CONFIG: AuthConfig = {
    storeKey: '_token',
    tokenInvalidRedirect: true,
    tokenExpOffset: 10,
    tokenSendKey: 'token',
    tokenSendTemplate: '${token}',
    loginUrl: '/login',
    referrerKey: 'redirect_uri',
    ignores: [/\/login/, /assets\//, /passport\//],
    refreshTime: 3000,
    refreshOffset: 6000
};

export function mergeConfig(config?: AuthConfig): AuthConfig {
    return Object.assign(DEFAULT_CONFIG, config);
}
