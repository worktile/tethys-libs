import { ThySharedModule } from 'ngx-tethys/shared';
import { ThyActionModule } from 'ngx-tethys/action';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThyIconModule } from 'ngx-tethys/icon';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { ThyBoardComponent } from './board.component';
import { ThyBoardLaneComponent } from './lane/lane.component';
import { ThyBoardEntryComponent } from './entry/entry.component';
import { ThyBoardHeaderComponent } from './header/header.component';

const TETHYS_MODULES = [ThyTooltipModule, ThyIconModule, ThyActionModule, ThySharedModule];

@NgModule({
    imports: [...TETHYS_MODULES, CommonModule, ThyBoardComponent, ThyBoardLaneComponent, ThyBoardEntryComponent, ThyBoardHeaderComponent],
    exports: [ThyBoardComponent],
    providers: []
})
export class ThyProBoardModule {}
