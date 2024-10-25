import { InjectionToken, OutputEmitterRef, Signal, TemplateRef } from '@angular/core';

import {
    ThyBoardCard,
    ThyBoardDragPredicateEvent,
    ThyBoardDragScopeType,
    ThyBoardDropActionEvent,
    ThyBoardEntry,
    ThyBoardLane,
    ThyBoardVirtualScrolledIndexChangeEvent,
    ThyBoardZone
} from '../entities';
import { SafeAny } from 'ngx-tethys/types';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';

export const THY_BOARD_ENTRY = new InjectionToken<ThyBoardEntryAbstract>('ThyBoardEntryComponent');

export interface ThyBoardEntryAbstract {
    entry: Signal<ThyBoardEntry>;

    hasLane: Signal<boolean>;

    lane: Signal<ThyBoardLane>;

    laneHeight: Signal<number>;

    virtualScroll: Signal<boolean>;

    cardTemplateRef: Signal<TemplateRef<SafeAny>>;

    container: Signal<HTMLElement>;

    defaultCardSize: Signal<number>;

    draggingCard: Signal<CdkDrag<ThyBoardCard>>;

    hasDroppableZones: Signal<boolean>;

    cardDroppableZones: Signal<
        {
            laneId?: string;
            entryId: string;
            droppableZones: ThyBoardZone[];
        }[]
    >;

    topTemplateRef: Signal<TemplateRef<SafeAny>>;

    bottomTemplateRef: Signal<TemplateRef<SafeAny>>;

    sortable: Signal<ThyBoardDragScopeType>;

    movable: Signal<ThyBoardDragScopeType>;

    cardDraggablePredicate: Signal<(event: ThyBoardDragPredicateEvent) => boolean>;

    cardDropEnterPredicate: Signal<(event: ThyBoardDragPredicateEvent) => boolean>;

    cardDropAction: Signal<(event: ThyBoardDropActionEvent) => Observable<boolean>>;

    cardDragStarted: OutputEmitterRef<CdkDrag<ThyBoardCard>>;

    virtualScrolledIndexChange: OutputEmitterRef<ThyBoardVirtualScrolledIndexChangeEvent>;
}
