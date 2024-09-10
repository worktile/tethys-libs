import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { ThyBoardCard, ThyBoardEntry, ThyBoardLane } from './board.entity';

export type ThyDropEnterPredicate = (event: { drag: CdkDrag; drop: CdkDropList }) => boolean;

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
