import { DOCUMENT } from '@angular/common';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ThyAuthConfig } from './auth.config';
import { ThyAuthIllegalJWTTokenError, ThyAuthToken, ThyAuthTokenClass } from './token/token';
import { SafeAny } from './types';

export function redirectToLogin(options: ThyAuthConfig, injector: Injector, url?: string): void {
    const router = injector.get<Router>(Router);
    if (options.tokenInvalidRedirect === true && location.pathname !== options.loginUrl) {
        setTimeout(() => {
            const loginUrl = `${options.loginUrl}?${options.referrerKey}=${url || router.url}`;
            if (/^https?:\/\//g.test(options.loginUrl!)) {
                injector.get(DOCUMENT).location.href = loginUrl;
            } else {
                router.navigateByUrl(loginUrl);
            }
        });
    }
}

export function urlBase64Decode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
        case 0: {
            break;
        }
        case 2: {
            output += '==';
            break;
        }
        case 3: {
            output += '=';
            break;
        }
        default: {
            throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
        }
    }
    return b64DecodeUnicode(output);
}

export function decodeJwtPayload(payload: string): any {
    const parts = payload.split('.');

    if (parts.length !== 3) {
        throw new ThyAuthIllegalJWTTokenError(`The payload ${payload} is not valid JWT payload and must consist of three parts.`);
    }

    let decoded;
    try {
        decoded = urlBase64Decode(parts[1]);
    } catch (e) {
        throw new ThyAuthIllegalJWTTokenError(`The payload ${payload} is not valid JWT payload and cannot be parsed.`);
    }

    if (!decoded) {
        throw new ThyAuthIllegalJWTTokenError(`The payload ${payload} is not valid JWT payload and cannot be decoded.`);
    }
    return JSON.parse(decoded);
}

function b64decode(str: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';

    str = String(str).replace(/=+$/, '');

    for (
        // initialize result and counters
        let bc = 0, bs: SafeAny, buffer: SafeAny, idx = 0;
        // get next character
        (buffer = str.charAt(idx++));
        // character found in table? initialize bit storage and add its ascii value;
        ~buffer &&
        ((bs = bc % 4 ? bs * 64 + buffer : buffer),
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4)
            ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
            : 0
    ) {
        // try to find character in table (0-63, not found => -1)
        buffer = chars.indexOf(buffer);
    }
    return output;
}

function b64DecodeUnicode(str: string): string {
    return decodeURIComponent(
        Array.prototype.map
            .call(b64decode(str), (c: string) => {
                return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
            })
            .join('')
    );
}

export function createAuthToken<T extends ThyAuthToken>(
    tokenClass: ThyAuthTokenClass<T>,
    value: SafeAny,
    failWhenInvalidToken?: boolean
): T {
    const token = new tokenClass(value);
    // At this point, nbAuthCreateToken failed with NbAuthIllegalTokenError which MUST be intercepted by strategies
    // Or token is created. It MAY be created even if backend did not return any token, in this case it is !Valid
    if (failWhenInvalidToken && !token.isValid()) {
        // If we require a valid token (i.e. isValid), then we MUST throw NbAuthIllegalTokenError so that the strategies
        // intercept it
        throw new ThyAuthIllegalJWTTokenError('Token is empty or invalid.');
    }
    return token;
}
