import { AuthTokenModel } from '../interface';
import { AuthStore } from './interface';

export function AUTH_STORE_TOKEN_LOCAL_FACTORY(): AuthStore {
    return new LocalStorageStore();
}

export class LocalStorageStore implements AuthStore {
    get(key: string): AuthTokenModel {
        return JSON.parse(localStorage.getItem(key) || '{}') || {};
    }

    set(key: string, value: AuthTokenModel | null): boolean {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    }

    remove(key: string): void {
        localStorage.removeItem(key);
    }
}
