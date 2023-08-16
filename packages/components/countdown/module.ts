import { ThyButtonModule } from 'ngx-tethys/button';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThyCountdownComponent } from './countdown.component';

@NgModule({
    imports: [ThyButtonModule, RouterModule, CommonModule, ThyCountdownComponent],
    exports: [ThyCountdownComponent],
    providers: []
})
export class ThyProCountdownModule {}
