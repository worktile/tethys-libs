import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ThyButtonModule } from 'ngx-tethys/button';
import { THY_SETTING_KEYS } from './core';
import { ThyCountdownComponent } from './countdown/countdown.component';
import { ThyProLayoutModule } from './layout/module';

const PRO_COMPONENTS = [ThyCountdownComponent];

const PRO_MODULES = [ThyProLayoutModule];

const TETHYS_MODULES = [ThyButtonModule];
@NgModule({
    declarations: [...PRO_COMPONENTS],
    imports: [...PRO_MODULES, TETHYS_MODULES, CommonModule, FormsModule, RouterModule],
    exports: [...PRO_COMPONENTS, ...PRO_MODULES],
    providers: [
        {
            provide: THY_SETTING_KEYS,
            useValue: {
                layout: 'layout',
                user: 'user'
            }
        }
    ]
})
export class TethysComponentsModule {}
