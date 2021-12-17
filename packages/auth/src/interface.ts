import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuthConfig {
    /**
     * 存储KEY值，默认：`_token`
     */
    storeKey?: string;
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
     * 发送token参数名，默认：·
     */
    tokenSendKey?: string;
    /**
     * 发送token模板（默认为：`'${token}'`），使用 `${token}` 表示token点位符（**注意：**请务必使用 \`\` 包裹），例如：
     *
     * - `Bearer ${token}`
     */
    tokenSendTemplate?: string;
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
export interface AuthTokenModel {
    [key: string]: AuthSafeAny;
    token: string | null | undefined;
    /**
     * 过期时间，单位：ms
     * - 不管Simple、JWT模式都必须指定
     */
    expired?: number;
}

export interface AuthTokenService {
    /**
     * 授权失败后跳转路由路径（支持外部链接地址），通过设置[全局配置]来改变
     */
    readonly loginUrl: string | undefined;

    readonly options: AuthConfig;

    /**
     * 订阅刷新，订阅时会自动产生一个定时器，每隔一段时间进行一些校验
     * - **注意** 会多次触发，请务必做好业务判断
     */
    readonly refresh: Observable<AuthTokenModel>;

    /**
     * 设置 Token 信息，当用户 Token 发生变动时都需要调用此方法重新刷新
     * - 如果需要监听过期，需要传递 `expired` 值
     */
    set(data: AuthTokenModel | null): boolean;

    /**
     * 获取Token，形式包括：
     * - `get()` 获取 Simple Token
     * - `get<JWTTokenModel>(JWTTokenModel)` 获取 JWT Token
     */
    get(type?: AuthSafeAny): AuthTokenModel | null;

    /**
     * 获取Token，形式包括：
     * - `get()` 获取 Simple Token
     * - `get<JWTTokenModel>(JWTTokenModel)` 获取 JWT Token
     */
    get<T extends AuthTokenModel>(type?: AuthSafeAny): T;

    /**
     * 清除 Token 信息，当用户退出登录时调用。
     * ```
     * // 清除所有 Token 信息
     * tokenService.clear();
     * // 只清除 token 字段
     * tokenService.clear({ onlyToken: true });
     * ```
     */
    clear(options?: { onlyToken: boolean }): void;

    /**
     * 订阅 Token 对象变更通知
     */
    change(): Observable<AuthTokenModel | null>;
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');

export const AUTH_CONFIG_FACTORY = {
    provide: AUTH_CONFIG,
    useValue: {}
};

export declare type AuthSafeAny = any;
