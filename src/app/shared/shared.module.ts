import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { ThyMenuModule } from 'ngx-tethys/menu';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyFormModule, THY_FORM_CONFIG } from 'ngx-tethys/form';
import { ThyInputModule } from 'ngx-tethys/input';
import { ThyTableModule } from 'ngx-tethys/table';
import { ThySpaceModule } from 'ngx-tethys/space';
import { ThyDialogModule } from 'ngx-tethys/dialog';
import { ThyNavModule } from 'ngx-tethys/nav';
import { ThyAvatarModule } from 'ngx-tethys/avatar';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TethysComponentsModule } from '@tethys/pro';
import { ThyStepperModule } from 'ngx-tethys/stepper';
import { ThySharedModule } from 'ngx-tethys/shared';
import { ThyActionModule } from 'ngx-tethys/action';

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
    ThyActionModule
];
const PRO_MODULES = [TethysComponentsModule];

@NgModule({
    declarations: [SidebarComponent],
    imports: [CommonModule, FormsModule, RouterModule, ...TETHYS_MODULES, ...PRO_MODULES],
    exports: [CommonModule, FormsModule, RouterModule, ...TETHYS_MODULES, ...PRO_MODULES, SidebarComponent],
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
