import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThyActionModule } from 'ngx-tethys/action';
import { ThyAvatarModule } from 'ngx-tethys/avatar';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyDialogModule } from 'ngx-tethys/dialog';
import { ThyFormModule } from 'ngx-tethys/form';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyInputModule } from 'ngx-tethys/input';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { ThyMenuModule } from 'ngx-tethys/menu';
import { ThyNavModule } from 'ngx-tethys/nav';
import { ThySharedModule } from 'ngx-tethys/shared';
import { ThySpaceModule } from 'ngx-tethys/space';
import { ThyStepperModule } from 'ngx-tethys/stepper';
import { ThyTableModule } from 'ngx-tethys/table';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';

export const TETHYS_MODULES = [
    ThyLayoutModule,
    ThyButtonModule,
    ThyMenuModule,
    ThyIconModule,
    ThyFormModule,
    ThyInputModule,
    ThyStepperModule,
    ThySharedModule,
    ThyTableModule,
    ThySpaceModule,
    ThyDialogModule,
    ThyNavModule,
    ThyAvatarModule,
    ThyTooltipModule,
    ThyActionModule
];

@NgModule({
    declarations: [],
    imports: [CommonModule, ...TETHYS_MODULES],
    exports: [...TETHYS_MODULES]
})
export class NgxTethysModule {}
