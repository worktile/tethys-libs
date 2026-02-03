import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { provideZoneChangeDetection } from '@angular/core';

platformBrowser()
    .bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()] })
    .catch((err) => console.error(err));
