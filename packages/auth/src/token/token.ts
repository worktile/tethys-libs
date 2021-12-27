import { SafeAny } from '../types';

export abstract class ThyAuthToken<T = unknown> {
    protected payload!: T | null;

    abstract getValue(): string;
    abstract isValid(): boolean;
    abstract toString(): string;

    getPayload(): T | null {
        return this.payload;
    }
}

export interface ThyAuthTokenClass<T = ThyAuthToken> {
    new (raw: SafeAny, createdAt?: Date | null): T;
}

export function thyAuthCreateToken<T extends ThyAuthToken>(tokenClass: ThyAuthTokenClass<T>, value: SafeAny, createdAt?: Date | null) {
    return new tokenClass(value, createdAt);
}

export class ThyAuthBaseToken<T = unknown> extends ThyAuthToken<T> {
    constructor(protected readonly token: string, protected createdAt?: Date) {
        super();
        try {
            this.parsePayload();
        } catch (err) {
            if (!(err instanceof ThyAuthTokenNotFoundError)) {
                // token is present but has got a problem, including illegal
                throw err;
            }
        }
        this.createdAt = createdAt && this.prepareCreatedAt(createdAt);
    }

    protected parsePayload() {
        this.payload = null;
    }

    protected prepareCreatedAt(date: Date) {
        return date ? date : new Date();
    }

    /**
     * Returns the token's creation date
     * @returns {Date}
     */
    getCreatedAt(): Date {
        return this.createdAt as Date;
    }

    /**
     * Returns the token value
     * @returns string
     */
    getValue(): string {
        return this.token;
    }

    /**
     * Is non empty and valid
     * @returns {boolean}
     */
    isValid(): boolean {
        return !!this.getValue();
    }

    /**
     * Validate value and convert to string, if value is not valid return empty string
     * @returns {string}
     */
    toString(): string {
        return !!this.token ? this.token : '';
    }
}

export class ThyAuthTokenNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class ThyAuthIllegalJWTTokenError extends ThyAuthTokenNotFoundError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
