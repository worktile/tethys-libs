import {
    ChangeDetectionStrategy,
    Component,
    TemplateRef,
    booleanAttribute,
    input,
    numberAttribute,
    output,
    viewChild
} from '@angular/core';
import { SafeAny } from 'ngx-tethys/types';

import {
    ThyBoardCard,
    ThyBoardDragScopeType,
    ThyBoardDropActionEvent,
    ThyBoardDragPredicateEvent,
    ThyBoardEntry,
    ThyBoardLane,
    ThyBoardZone,
    ThyBoardVirtualScrolledIndexChangeEvent
} from '../entities';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';

import { THY_BOARD_ENTRY } from '../entities';
import { ThyBoardEntryBase } from './entry-base';
import { ThyBoardSortableEntryComponent } from './sortable/sortable.component';
import { ThyBoardMovableEntryComponent } from './movable/movable.component';

@Component({
    selector: 'thy-board-entry',
    templateUrl: 'entry.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: THY_BOARD_ENTRY,
            useExisting: ThyBoardEntryComponent
        }
    ],
    imports: [ThyBoardSortableEntryComponent, ThyBoardMovableEntryComponent],
    host: {
        class: 'thy-entry-container board-lane-body-entry',
        '[class.thy-entry-collapsed]': '!entry()?.expanded'
    }
})
export class ThyBoardEntryComponent {
    entryComponent = viewChild(ThyBoardEntryBase);

    entry = input.required<ThyBoardEntry>();

    hasLane = input(false, { transform: booleanAttribute });

    lane = input<ThyBoardLane>();

    laneHeight = input(0, { transform: numberAttribute });

    virtualScroll = input(false, { transform: booleanAttribute });

    cardTemplateRef = input<TemplateRef<SafeAny>>();

    container = input.required<HTMLElement>();

    defaultCardSize = input(112, { transform: numberAttribute });

    draggingCard = input<CdkDrag<ThyBoardCard>>();

    hasDroppableZones = input<boolean>();

    /**
     * 获取卡片可放置的区域
     */
    cardDroppableZones = input<
        {
            laneId?: string;
            entryId: string;
            droppableZones: ThyBoardZone[];
        }[]
    >();

    topTemplateRef = input<TemplateRef<SafeAny>>();

    bottomTemplateRef = input<TemplateRef<SafeAny>>();

    /**
     * 是否支持排序,开启后支持同栏排序
     * @default false
     * @type boolean
     */
    sortable = input<ThyBoardDragScopeType>();

    /**
     * 是否支持拖动，变更栏和泳道
     * @default false
     * @type boolean
     */
    movable = input<ThyBoardDragScopeType>();

    cardDraggablePredicate = input<(event: ThyBoardDragPredicateEvent) => boolean>();

    cardDropEnterPredicate = input<(event: ThyBoardDragPredicateEvent) => boolean>();

    cardDropAction = input<(event: ThyBoardDropActionEvent) => Observable<boolean>>();

    cardDragStarted = output<CdkDrag<ThyBoardCard>>();

    virtualScrolledIndexChange = output<ThyBoardVirtualScrolledIndexChangeEvent>();

    scrollToOffset(payload: { position: 'top' | 'middle' | 'bottom'; scrollTop: number; laneHight: number }) {
        this.entryComponent()?.scrollToOffset(payload);
    }
}
