import { NgModule } from '@angular/core';
import { ThyCountdownComponent } from './countdown/countdown.component';
import { ThyProLayoutModule } from './layout/module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

const PRO_COMPONENTS = [ThyCountdownComponent];

const PRO_MODULES = [ThyProLayoutModule];

@NgModule({
    declarations: [...PRO_COMPONENTS],
    imports: [...PRO_MODULES, CommonModule, FormsModule, RouterModule],
    exports: [...PRO_COMPONENTS, ...PRO_MODULES]
})
export class TethysComponentsModule {}
