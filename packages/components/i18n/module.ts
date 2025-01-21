import { NgModule } from '@angular/core';
import { ThyI18nPipe } from './i18n.pipe';

@NgModule({
    imports: [ThyI18nPipe],
    exports: [ThyI18nPipe],
    providers: []
})
export class ThyProI18nModule {}
