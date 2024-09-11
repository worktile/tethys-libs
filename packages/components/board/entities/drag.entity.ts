import { ThyBoardCard, ThyBoardEntry, ThyBoardLane } from './board.entity';

export interface ThyBoardDragContainer {
    entry: ThyBoardEntry;

    lane?: ThyBoardLane;

    cards?: ThyBoardCard[];
}

export interface ThyBoardDragStartEvent {
    card: ThyBoardCard;
}

export interface ThyBoardDropEnterPredicateEvent {
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
