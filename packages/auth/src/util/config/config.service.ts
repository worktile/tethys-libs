import { Inject, Injectable, Optional } from '@angular/core';
import { deepMergeKey } from '../other/deep';
import { CONFIG, Config, ConfigKey } from './config.info';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: Config;

  constructor(@Optional() @Inject(CONFIG) defaultConfig?: Config) {
    this.config = { ...defaultConfig };
  }

  get<T extends ConfigKey>(componentName: T, key?: string): Config[T] {
    const res = ((this.config[componentName] as { [key: string]: any }) || {}) as any;
    return key ? { [key]: res[key] } : res;
  }

  merge<T extends ConfigKey>(componentName: T, ...defaultValues: Config[T][]): Config[T] {
    return deepMergeKey({}, true, ...defaultValues, this.get(componentName));
  }

  attach<T extends ConfigKey>(componentThis: any, componentName: T, defaultValues: Config[T]): void {
    Object.assign(componentThis, this.merge(componentName, defaultValues));
  }

  attachKey<T extends ConfigKey>(componentThis: any, componentName: T, key: string): void {
    Object.assign(componentThis, this.get(componentName, key));
  }

  set<T extends ConfigKey>(componentName: T, value: Config[T]): void {
    this.config[componentName] = { ...this.config[componentName], ...value };
  }
}
