import { ThyButtonModule } from 'ngx-tethys/button';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThyCountdownComponent } from './countdown.component';

@NgModule({
    declarations: [ThyCountdownComponent],
    imports: [ThyButtonModule, RouterModule, CommonModule],
    exports: [ThyCountdownComponent],
    providers: []
})
export class ThyProCountdownModule {}
