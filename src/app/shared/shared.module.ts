import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ThyProCountdownModule } from '@tethys/pro/countdown';
import { ThyProLayoutModule } from '@tethys/pro/layout';
import { ThyProMediaModule } from '@tethys/pro/media';
import { ThyActionModule } from 'ngx-tethys/action';
import { ThyAvatarModule } from 'ngx-tethys/avatar';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyCardModule } from 'ngx-tethys/card';
import { ThyCheckboxModule } from 'ngx-tethys/checkbox';
import { ThyDialogModule } from 'ngx-tethys/dialog';
import { ThyDividerModule } from 'ngx-tethys/divider';
import { ThyDropdownModule } from 'ngx-tethys/dropdown';
import { ThyFormModule, THY_FORM_CONFIG } from 'ngx-tethys/form';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyInputModule } from 'ngx-tethys/input';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { ThyMenuModule } from 'ngx-tethys/menu';
import { ThyNavModule } from 'ngx-tethys/nav';
import { ThyResultModule } from 'ngx-tethys/result';
import { ThySharedModule } from 'ngx-tethys/shared';
import { ThySpaceModule } from 'ngx-tethys/space';
import { ThyStepperModule } from 'ngx-tethys/stepper';
import { ThyTableModule } from 'ngx-tethys/table';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';

const TETHYS_MODULES = [
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
    ThyActionModule,
    ThyCardModule,
    ThyCheckboxModule,
    ThyDividerModule,
    ThyResultModule,
    ThyDropdownModule
];

const PRO_MODULES = [ThyProLayoutModule, ThyProCountdownModule, ThyProMediaModule];

const SHARED_COMPONENT: never[] = [];

@NgModule({
    declarations: [...SHARED_COMPONENT],
    imports: [CommonModule, FormsModule, RouterModule, ...TETHYS_MODULES, ...PRO_MODULES],
    exports: [CommonModule, FormsModule, RouterModule, ...TETHYS_MODULES, ...PRO_MODULES, ...SHARED_COMPONENT],
    providers: [
        {
            provide: THY_FORM_CONFIG,
            useValue: {
                layout: 'vertical',
                footerAlign: 'right'
            }
        }
    ]
})
export class SharedModule {}
