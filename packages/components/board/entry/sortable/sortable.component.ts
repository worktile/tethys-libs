import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { ThyBoardEntryVirtualScroll } from '../../scroll/entry-virtual-scroll';
import { CdkDrag, CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { ThyDragDropDirective } from 'ngx-tethys/shared';
import { ThyBoardFuncPipe } from '../../board.pipe';
import { ThyBoardEntryBase } from '../entry-base';
import { THY_BOARD_ENTRY, ThyBoardCard, ThyBoardDragContainer, ThyBoardDragScopeType, ThyBoardEntryAbstract } from '../../entities';
import { SafeAny } from 'ngx-tethys/types';
import { tap } from 'rxjs';
import { injectLocale } from '@tethys/pro/i18n';

@Component({
    selector: 'thy-board-sortable-entry',
    templateUrl: 'sortable.component.html',
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
    locale = injectLocale();

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

    drop(event: CdkDragDrop<ThyBoardDragContainer | SafeAny>) {
        const droppedList = event.container.data?.cards.filter((card: ThyBoardCard) => {
            return card._id !== event.item.data._id;
        });
        const currentPreOrAfterCard = event.container.data.card;
        const currentPreOrAfterCardIndex =
            (droppedList || []).findIndex((card: ThyBoardCard) => {
                return card._id === currentPreOrAfterCard?._id;
            }) || 0;
        const currentIndex = event.currentIndex ? currentPreOrAfterCardIndex + 1 : currentPreOrAfterCardIndex;

        const previousIndex = (event.previousContainer.data?.cards || []).findIndex(
            (card: ThyBoardCard) => card._id === event.item.data._id
        );

        transferArrayItem(event.previousContainer.data?.cards!, event.container.data?.cards!, previousIndex, currentIndex);
        const cardDropAction = this.boardEntry.cardDropAction();
        if (cardDropAction) {
            cardDropAction({
                card: event.item.data,
                previousContainer: event.previousContainer.data!,
                previousIndex: previousIndex,
                container: event.container.data!,
                currentIndex: currentIndex
            })
                .pipe(
                    tap((result: boolean) => {
                        if (!result) {
                            transferArrayItem(
                                event.container.data?.cards!,
                                event.previousContainer.data?.cards!,
                                currentIndex,
                                previousIndex
                            );
                            event.previousContainer.data.changeDetectorRef.markForCheck();
                            this.changeDetectorRef.markForCheck();
                        }
                    })
                )
                .subscribe();
        }
    }
}
