import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ThyFlexItem } from 'ngx-tethys/grid';

import { ThyBoardEntryVirtualScroll } from '../../scroll/entry-virtual-scroll';
import { CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';
import { ThyDragDropDirective } from 'ngx-tethys/shared';
import { ThyBoardFuncPipe } from '../../board.pipe';
import { ThyBoardEntryBase } from '../entry-base';
import { THY_BOARD_ENTRY, ThyBoardCard, ThyBoardDragContainer, ThyBoardDragScopeType, ThyBoardEntryAbstract } from '../../entities';

@Component({
    selector: 'thy-board-sortable-entry',
    templateUrl: 'sortable.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ThyBoardEntryBase,
            useExisting: ThyBoardSortableEntryComponent
        }
    ],
    imports: [
        NgStyle,
        NgTemplateOutlet,
        NgClass,
        ScrollingModule,
        DragDropModule,
        ExperimentalScrollingModule,
        ThyFlexItem,
        ThyBoardEntryVirtualScroll,
        ThyDragDropDirective,
        ThyBoardFuncPipe
    ],
    host: {
        class: 'thy-entry-sortable-container',
        '[class.thy-entry-collapsed]': '!boardEntry?.entry()?.expanded'
    }
})
export class ThyBoardSortableEntryComponent extends ThyBoardEntryBase {
    constructor(@Inject(THY_BOARD_ENTRY) public boardEntry: ThyBoardEntryAbstract) {
        super(boardEntry);
    }

    checkCardDroppable(drag: CdkDrag<ThyBoardCard>, container: ThyBoardDragContainer) {
        const originContainer = drag.dropContainer.data;
        if (this.boardEntry.sortable()) {
            if (this.boardEntry.sortable() === ThyBoardDragScopeType.entries) {
                // 支持拖动变更栏，并且排序: 泳道相同
                return this.boardEntry.hasLane() ? originContainer.lane._id === container.lane?._id : true;
            }
            if (this.boardEntry.sortable() === ThyBoardDragScopeType.lanes) {
                // 支持拖动变更泳道，并且排序: 栏相同
                return originContainer.entry._id === container.entry?._id;
            }
            if (this.boardEntry.sortable() === ThyBoardDragScopeType.all) {
                // 支持拖动变更栏和泳道，并且排序: 任意栏
                return true;
            }
        }
        return false;
    }
}