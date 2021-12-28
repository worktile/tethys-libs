import { JWTPayload } from '../types';
import { decodeJwtPayload } from '../utils';
import { ThyAuthTokenBase, ThyAuthTokenNotFoundError } from './token';

export class ThyAuthJWTToken extends ThyAuthTokenBase<JWTPayload> {
    /**
     * for JWT token, the iat (issued at) field of the token payload contains the creation Date
     */
    protected override prepareCreatedAt(date: Date): Date {
        const decoded = this.getPayload();
        return decoded && decoded.iat ? new Date(Number(decoded.iat) * 1000) : date ? date : new Date();
    }

    /**
     * Returns payload object
     * @returns any
     */
    protected override parsePayload(): void {
        if (!this.token) {
            throw new ThyAuthTokenNotFoundError('Token not found. ');
        }
        this.payload = decodeJwtPayload(this.token);
    }

    /**
     * Returns expiration date
     * @returns Date
     */
    getTokenExpDate(): Date | null {
        const decoded = this.getPayload();
        if (decoded && !decoded.hasOwnProperty('exp')) {
            return null;
        }
        const date = new Date(0);
        date.setUTCSeconds(decoded!.exp); // 'cause jwt token are set in seconds
        return date;
    }

    /**
     * Is data expired
     * @returns {boolean}
     */
    override isValid(): boolean {
        return super.isValid() && (!this.getTokenExpDate() || new Date() < this.getTokenExpDate()!);
    }
}
