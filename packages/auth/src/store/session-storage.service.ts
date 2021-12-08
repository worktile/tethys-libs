import { AuthTokenModel } from '../interface';
import { AuthStore } from './interface';

export class SessionStorageStore implements AuthStore {
  get(key: string): AuthTokenModel {
    return JSON.parse(sessionStorage.getItem(key) || '{}') || {};
  }

  set(key: string, value: AuthTokenModel | null): boolean {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  }

  remove(key: string): void {
    sessionStorage.removeItem(key);
  }
}
