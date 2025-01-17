import { ThySiteSettings } from './global.entity';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { THY_DEFAULT_SITE_SETTINGS, THY_SITE_SETTINGS } from './settings.config';

export function provideSettings(settings: ThySiteSettings): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: THY_SITE_SETTINGS,
            useValue: Object.assign({}, THY_DEFAULT_SITE_SETTINGS, settings)
        }
    ]);
}
