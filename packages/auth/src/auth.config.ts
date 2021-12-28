import { InjectionToken } from '@angular/core';

export interface ThyAuthConfig {
    /**
     * 存储KEY值，默认：`_token`
     */
    tokenStoreKey?: string;
    /**
     * 无效时跳转至登录页，默认：`true`，包括：
     * - 无效token值
     * - token已过期（限JWT）
     */
    tokenInvalidRedirect?: boolean;
    /**
     * token过期时间偏移值，默认：`10` 秒（单位：秒）
     */
    tokenExpOffset?: number;
    /**
     * 登录页路由地址，默认：`/login`
     */
    loginUrl?: string;
    /**
     * 跳转到登录页面的来源地址 key, 默认：`redirect_uri`
     */
    referrerKey?: string;
    /**
     * 忽略TOKEN的URL地址列表，默认值为：`[/\/login/, /assets\//, /passport\//]`
     */
    ignores?: RegExp[];
    /**
     * 刷新间隔时长（单位：ms），默认：`3000`
     */
    refreshTime?: number;
    /**
     * 过期计算偏移值（单位：ms），默认：`6000`
     * - **建议**根据 `refreshTime` 倍数来设置
     */
    refreshOffset?: number;
}


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
