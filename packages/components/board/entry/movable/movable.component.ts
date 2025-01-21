import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Inject } from '@angular/core';
import { ThyFlexItem } from 'ngx-tethys/grid';

import { ThyBoardEntryVirtualScroll } from '../../scroll/entry-virtual-scroll';
import { CdkDrag, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';
import { ThyDragDropDirective } from 'ngx-tethys/shared';
import { ThyBoardFuncPipe } from '../../board.pipe';
import { ThyBoardEntryBase } from '../entry-base';
import { THY_BOARD_ENTRY, ThyBoardCard, ThyBoardDragContainer, ThyBoardDragScopeType, ThyBoardEntryAbstract } from '../../entities';
import { injectLocale } from '@tethys/pro/i18n';

@Component({
    selector: 'thy-board-movable-entry',
    templateUrl: 'movable.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ThyBoardEntryBase,
            useExisting: ThyBoardMovableEntryComponent
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
        class: 'thy-entry-movable-container',
        '[class.thy-entry-collapsed]': '!boardEntry.entry()?.expanded'
    }
})
export class ThyBoardMovableEntryComponent extends ThyBoardEntryBase {
    locale = injectLocale();

    public isDraggingList = false;

    public showBackDropWhenDragging = computed(() => {
        const movable = this.boardEntry.movable();
        const draggingCard = this.boardEntry.draggingCard();
        if (draggingCard) {
            if (movable) {
                return this.checkCardDroppable(draggingCard, { entry: this.boardEntry.entry(), lane: this.boardEntry.lane() });
            }
        } else {
            this.isDraggingList = false;
        }
        return false;
    });

    cardDroppableZone = computed(() => {
        const cardDroppableZones = this.boardEntry.cardDroppableZones();
        const hasDroppableZones = this.boardEntry.hasDroppableZones();
        if (hasDroppableZones) {
            const entry = this.boardEntry.entry();
            const draggingCard = this.boardEntry.draggingCard();
            if (draggingCard && cardDroppableZones) {
                return this.boardEntry.hasLane()
                    ? (cardDroppableZones &&
                          cardDroppableZones?.find(
                              (zone) => zone.entryId === this.boardEntry.entry()._id && zone.laneId === this.boardEntry.lane()?._id
                          )?.droppableZones) ||
                          null
                    : (cardDroppableZones &&
                          cardDroppableZones?.find((zone) => zone.entryId === this.boardEntry.entry()._id)?.droppableZones) ||
                          null;
            } else {
                return entry.droppableZones || [];
            }
        }
        return [];
    });

    dropReady = computed(() => {
        const cardDroppableZones = this.boardEntry.cardDroppableZones();
        const draggingCard = this.boardEntry.draggingCard();
        const hasDroppableZones = this.boardEntry.hasDroppableZones();
        if (hasDroppableZones) {
            if (draggingCard && cardDroppableZones) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    });

    constructor(@Inject(THY_BOARD_ENTRY) public boardEntry: ThyBoardEntryAbstract) {
        super(boardEntry);
    }

    cdkDragStarted(event: CdkDragStart) {
        this.isDraggingList = true;
        if (this.boardEntry.movable()) {
            const cardHeight = event.source.dropContainer.element.nativeElement.clientHeight;
            this.renderer.setStyle(event.source.dropContainer.element.nativeElement, 'height', cardHeight + 'px');
        }
        super.cdkDragStarted(event);
    }

    checkCardDroppable(drag: CdkDrag<ThyBoardCard>, container: ThyBoardDragContainer) {
        const originContainer = drag.dropContainer.data;
        if (this.boardEntry.movable()) {
            if (this.boardEntry.movable() === ThyBoardDragScopeType.entries) {
                // 支持变更栏 entry：泳道相同，且 不在原来的栏
                return this.boardEntry.hasLane()
                    ? originContainer.lane._id === container.lane?._id && originContainer.entry._id !== container.entry?._id
                    : originContainer.entry._id !== container.entry?._id;
            }
            if (this.boardEntry.movable() === ThyBoardDragScopeType.lanes) {
                // 支持变更泳道 lane: 栏相同 且 不在原来的泳道
                return this.boardEntry.hasLane()
                    ? originContainer.entry._id === container.entry?._id && originContainer.lane._id !== container.lane?._id
                    : false;
            }
            if (this.boardEntry.movable() === ThyBoardDragScopeType.all) {
                // 支持变更栏和泳道: 不在原来的栏或者不在原来的泳道
                return this.boardEntry.hasLane()
                    ? originContainer.entry._id !== container.entry?._id || originContainer.lane._id !== container.lane?._id
                    : originContainer.entry._id !== container.entry?._id;
            }
        }
        return false;
    }
}
