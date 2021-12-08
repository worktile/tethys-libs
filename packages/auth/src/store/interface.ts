import { InjectionToken } from '@angular/core';
import { AuthTokenModel } from '../interface';
import { AUTH_STORE_TOKEN_LOCAL_FACTORY } from './local-storage.service';

export const AUTH_STORE_TOKEN = new InjectionToken<AuthStore>('AUTH_STORE_TOKEN', {
  providedIn: 'root',
  factory: AUTH_STORE_TOKEN_LOCAL_FACTORY 
});

export interface AuthStore {
  get(key: string): AuthTokenModel;

  set(key: string, value: AuthTokenModel): boolean;

  remove(key: string): void;
}
