import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { RootComponent } from './app/content/index';
import { AppModule } from './app/app.module';

bootstrapApplication(RootComponent, {
    providers: [importProvidersFrom(AppModule), provideZoneChangeDetection()]
}).catch((err: unknown) => console.error(err));
