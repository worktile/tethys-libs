import { InjectionToken } from '@angular/core';
import { AuthConfig } from '../../interface';

export interface Config {
  auth?: AuthConfig;
}

export type ConfigKey = keyof Config;

export const CONFIG = new InjectionToken<Config>('config', {
  providedIn: 'root',
  factory: CONFIG_FACTORY
});
export function CONFIG_FACTORY(): Config {
  return {};
}
