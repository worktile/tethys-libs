import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DocgeniTemplateModule } from '@docgeni/template';
import { ThyProLayoutModule } from '@tethys/pro/layout';
import { ThyActionModule } from 'ngx-tethys/action';
import { ThyAvatarModule } from 'ngx-tethys/avatar';
import { ThyIconRegistry } from 'ngx-tethys/icon';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { ThyMenuModule } from 'ngx-tethys/menu';
import { ThyNotifyModule } from 'ngx-tethys/notify';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { DOCGENI_SITE_PROVIDERS, IMPORT_MODULES, RootComponent } from './content/index';

const TETHYS_MODULES = [
    ThyLayoutModule,
    ThyMenuModule,
    ThyNotifyModule,
    ThyPopoverModule,
    ThyActionModule,
    ThyAvatarModule,
    ThyTooltipModule
];
@NgModule({
    declarations: [],
    providers: [...DOCGENI_SITE_PROVIDERS],
    imports: [
        ThyProLayoutModule,
        BrowserModule,
        BrowserAnimationsModule,
        DocgeniTemplateModule,
        RouterModule.forRoot([]),
        ...TETHYS_MODULES,
        ...IMPORT_MODULES
    ],
    exports: [],
    bootstrap: [RootComponent]
})
export class AppModule {
    constructor(iconRegistry: ThyIconRegistry, sanitizer: DomSanitizer) {
        const iconSvgUrl = 'assets/icons/defs/svg/sprite.defs.svg';
        iconRegistry.addSvgIconSet(sanitizer.bypassSecurityTrustResourceUrl(iconSvgUrl));
    }
}
