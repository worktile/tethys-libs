import { ChangeDetectorRef } from '@angular/core';
import { ThyBoardCard, ThyBoardEntry, ThyBoardEntryStatus, ThyBoardLane, ThyBoardZone } from './board.entity';

export interface ThyBoardDragContainer {
    entry: ThyBoardEntry;

    lane?: ThyBoardLane;

    cards?: ThyBoardCard[];

    card?: ThyBoardCard;

    status?: ThyBoardEntryStatus;

    zone?: ThyBoardZone;

    changeDetectorRef?: ChangeDetectorRef;
}

export interface ThyBoardDragStartEvent {
    card: ThyBoardCard;
}

export interface ThyBoardDragPredicateEvent {
    card: ThyBoardCard;

    container: ThyBoardDragContainer;
}

export interface ThyBoardDropActionEvent {
    card: ThyBoardCard;

    previousContainer: ThyBoardDragContainer;

    previousIndex: number;

    container: ThyBoardDragContainer;

    currentIndex: number;
}
