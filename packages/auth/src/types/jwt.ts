export interface JWTPayload {
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
}
