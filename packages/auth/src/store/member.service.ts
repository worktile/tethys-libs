import { AuthTokenModel } from '../interface';
import { AuthStore } from './interface';

export class MemoryStore implements AuthStore {
    private cache: { [key: string]: AuthTokenModel | null } = {};
    get(key: string): AuthTokenModel {
        return this.cache[key] || ({} as AuthTokenModel);
    }

    set(key: string, value: AuthTokenModel): boolean {
        this.cache[key] = value;
        return true;
    }

    remove(key: string): void {
        this.cache[key] = null;
    }
}
