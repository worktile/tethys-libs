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
import { ThyBoardEntryVirtualScroll } from './scroll/entry-virtual-scroll';
import { ThyBoardBodyScrollableDirective } from './scroll/board-body-scroll';
import { ThyBoardFuncPipe } from './board.pipe';
import { ThyBoardSkeletonComponent } from './skeleton/skeleton.component';
import { ThyBoardSortableEntryComponent } from './entry/sortable/sortable.component';
import { ThyBoardMovableEntryComponent } from './entry/movable/movable.component';
import { CdkScrollableModule } from '@angular/cdk/scrolling';

const TETHYS_MODULES = [ThyTooltipModule, ThyIconModule, ThyActionModule, ThySharedModule];

@NgModule({
    imports: [
        ...TETHYS_MODULES,
        CommonModule,
        CdkScrollableModule,
        ThyBoardComponent,
        ThyBoardBodyScrollableDirective,
        ThyBoardLaneComponent,
        ThyBoardEntryComponent,
        ThyBoardSortableEntryComponent,
        ThyBoardMovableEntryComponent,
        ThyBoardHeaderComponent,
        ThyBoardEntryVirtualScroll,
        ThyBoardFuncPipe,
        ThyBoardSkeletonComponent
    ],
    exports: [ThyBoardComponent],
    providers: []
})
export class ThyProBoardModule {}
