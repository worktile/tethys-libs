import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { THY_MENU_LOAD_STRATEGY } from './menu';
import { ThyMenuLoadDefaultStrategy } from './menu-load-default-strategy';

export function provideMenuLoadStrategy(factory: () => ThyMenuLoadDefaultStrategy): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: THY_MENU_LOAD_STRATEGY,
            useFactory: () => {
                return factory();
            }
        }
    ]);
}
