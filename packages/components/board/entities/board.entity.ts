import { ListRange } from '@angular/cdk/collections';

export interface ThyBoardLane {
    _id: string;

    name: string;

    cards?: ThyBoardCard[];

    entries?: ThyBoardEntry[];

    // 设置泳道展开收起状态，true 为展开
    expanded?: boolean;
}

export interface ThyBoardEntry {
    _id: string;

    name: string;

    wipLimit?: number;

    split?: boolean;

    cards?: ThyBoardCard[];

    // 设置泳道展开收起状态，true 为展开
    expanded?: boolean;

    droppableZones?: ThyBoardZone[];
}

export interface ThyBoardCard {
    _id: string;

    laneIds: string[];

    entryIds: string[];

    [key: string]: any;
}

export interface ThyBoardVirtualScrolledIndexChangeEvent {
    renderedRange: ListRange;
    entry: ThyBoardEntry;
    lane: ThyBoardLane;
    nextLane: ThyBoardLane;
    expandedLanes: ThyBoardLane[];
}

export interface ThyBoardZone {
    _id: string;

    name: string;
}
