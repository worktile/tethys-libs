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

export enum ThyBoardEntryStatus {
    doing = 1,
    done = 2
}

export interface ThyBoardCard {
    _id: string;

    laneIds: string[];

    entryIds: string[];

    /**
     * 添加 status，设置卡片是在进行中还是已完成栏
     * 当卡片在不同的栏和泳道中状态相同时，支持直接设置 ThyBoardEntryStatus
     * 当卡片在不同的泳道和栏中有不同的状态时，支持设置  {laneId?: string, entryId: string, state: ThyBoardEntryStatus}[]
     */
    status?: { laneId?: string; entryId: string; state: ThyBoardEntryStatus }[] | ThyBoardEntryStatus;

    [key: string]: any;
}

export interface ThyBoardVirtualScrolledIndexChangeEvent {
    renderedRange: ListRange;
    entry: ThyBoardEntry;
    lane?: ThyBoardLane;
    nextLane?: ThyBoardLane;
    expandedLanes?: ThyBoardLane[];
}

export interface ThyBoardZone {
    _id: string;

    name: string;
}
