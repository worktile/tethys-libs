import { AuthSafeAny, AuthTokenModel } from '../../interface';
import { urlBase64Decode } from './jwt.helper';

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

    [key: string]: AuthSafeAny;
    [key: number]: AuthSafeAny;
}

export class JWTTokenModel implements AuthTokenModel {
    [key: string]: AuthSafeAny;

    token: string | null | undefined;

    expired?: number;

    /**
     * 获取载荷信息
     */
    get payload(): JWT {
        const parts = (this.token || '').split('.');
        if (parts.length !== 3) throw new Error('JWT must have 3 parts');

        const decoded = urlBase64Decode(parts[1]);
        return JSON.parse(decoded);
    }

    /**
     * 获取过期时间戳（单位：ms）
     */
    get exp(): number | null {
        const decoded = this.payload;
        if (!decoded.hasOwnProperty('exp')) return null;
        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date.valueOf();
    }

    /**
     * 检查Token是否过期，当`payload` 包含 `exp` 字段时有效，若无 `exp` 字段直接返回 `null`
     *
     * @param offsetSeconds 偏移量
     */
    isExpired(offsetSeconds: number = 0): boolean | null {
        const exp = this.exp;
        if (exp == null) return null;

        return !(exp > new Date().valueOf() + offsetSeconds * 1000);
    }
}
