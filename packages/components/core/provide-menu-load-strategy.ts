import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { THY_MENU_LOAD_STRATEGY, ThyMenuLoadStrategy } from './menu';

export function provideMenuLoadStrategy(factory: () => ThyMenuLoadStrategy): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: THY_MENU_LOAD_STRATEGY,
            useFactory: () => {
                return factory();
            }
        }
    ]);
}
