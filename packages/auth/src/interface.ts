import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTH_SERVICE_TOKEN_FACTORY } from './token/token.service';

export interface AuthConfig {
  /**
   * 存储KEY值，默认：`_token`
   */
  store_key?: string;
  /**
   * 无效时跳转至登录页，默认：`true`，包括：
   * - 无效token值
   * - token已过期（限JWT）
   */
  token_invalid_redirect?: boolean;
  /**
   * token过期时间偏移值，默认：`10` 秒（单位：秒）
   */
  token_exp_offset?: number;
  /**
   * 发送token参数名，默认：·
   */
  token_send_key?: string;
  /**
   * 发送token模板（默认为：`'${token}'`），使用 `${token}` 表示token点位符（**注意：**请务必使用 \`\` 包裹），例如：
   *
   * - `Bearer ${token}`
   */
  token_send_template?: string;
  /**
   * 发送token参数位置，默认：`header`
   */
  token_send_place?: 'header' | 'body' | 'url';
  /**
   * 登录页路由地址，默认：`/login`
   */
  login_url?: string;
  /**
   * 忽略TOKEN的URL地址列表，默认值为：`[/\/login/, /assets\//, /passport\//]`
   */
  ignores?: RegExp[];
  /**
   * 允许匿名登录KEY，若请求参数中带有该KEY表示忽略TOKEN，默认：`_allow_anonymous`
   */
  allow_anonymous_key?: string;
  /**
   * 是否校验失效时命中后继续调用后续拦截器的 `intercept` 方法，默认：`true`
   */
  executeOtherInterceptors?: boolean;
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

export interface AuthReferrer {
  url?: string | null | undefined;
}

export interface AuthTokenService {
  /**
   * 授权失败后跳转路由路径（支持外部链接地址），通过设置[全局配置]来改变
   */
  readonly login_url: string | undefined;

  /**
   * 当前请求页面的来源页面的地址
   */
  readonly referrer?: AuthReferrer;

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

export const AUTH_SERVICE_TOKEN = new InjectionToken<AuthTokenService>('AUTH_SERVICE_TOKEN', {
  providedIn: 'root',
  factory: AUTH_SERVICE_TOKEN_FACTORY
});


export declare type AuthSafeAny = any;