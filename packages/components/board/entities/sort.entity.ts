import { ThyBoardCard, ThyBoardEntry, ThyBoardLane } from './board.entity';

export interface ThyBoardSortEvent {
    cards: ThyBoardCard[];
    lane?: ThyBoardLane;
    entry: ThyBoardEntry;
}
