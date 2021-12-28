import { SafeAny } from './types';

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

export interface JWT {
    /**
     * Issuerd
     * jwt签发者
     */
    iss: string;
    /**
     * Issued At
     * jwt的签发时间
     */
    iat: string;
    /**
     * Subject
     * jwt所面向的用户
     */
    sub: string;
    /**
     * Expiration Time
     * jwt的过期时间，这个过期时间必须要大于签发时间
     */
    exp: number;
    /**
     * Audience
     * 接收jwt的一方
     */
    aud: string;
    /**
     * Not Before
     * 定义在什么时间之前，该jwt都是不可用的.
     */
    nbf: string;
    /**
     * JWT ID
     * jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。
     */
    jti: string;

    [key: string]: SafeAny;
    [key: number]: SafeAny;
}
