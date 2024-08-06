import { ListRange } from '@angular/cdk/collections';

export interface ThyBoardLane {
    _id: string;

    name: string;

    cards?: ThyBoardCard[];

    entries?: ThyBoardEntry[];
}

export interface ThyBoardEntry {
    _id: string;

    name: string;

    wipLimit?: number;

    split?: boolean;

    cards?: ThyBoardCard[];
}

export interface ThyBoardCard {
    _id: string;

    laneId: string;

    entryId: string;

    [key: string]: any;
}

export interface ThyBoardVirtualScrolledIndexChangeEvent {
    renderedRange: ListRange;
    entry: ThyBoardEntry;
    lane: ThyBoardLane;
    nextLane: ThyBoardLane;
    expandedLanes: ThyBoardLane[];
}
