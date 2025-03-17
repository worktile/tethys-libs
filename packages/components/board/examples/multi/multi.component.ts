import { Component, OnInit } from '@angular/core';
import {
    ThyBoardCard,
    ThyBoardDragPredicateEvent,
    ThyBoardDragStartEvent,
    ThyBoardDropActionEvent,
    ThyBoardEntry,
    ThyBoardLane,
    ThyBoardSortEvent
} from '@tethys/pro/board';
import { delay, of } from 'rxjs';
import { entries, lanes } from '../mock';
import { items } from './mock';

interface CardInfo extends ThyBoardCard {
    title: string;
}

@Component({
    selector: 'thy-pro-board-multi-example',
    templateUrl: './multi.component.html',
    styleUrls: ['./multi.component.scss'],
    standalone: false
})
export class ThyProBoardMultiExampleComponent implements OnInit {
    entries: ThyBoardEntry[] = [...entries];

    items: CardInfo[] = [...(items as CardInfo[])];

    lanes: ThyBoardLane[] = [...lanes];

    constructor() {}

    ngOnInit(): void {
        setTimeout(() => {
            this.items = [
                ...this.items,
                {
                    _id: 'add',
                    title: '项目add',
                    laneIds: ['1'],
                    entryIds: ['3']
                }
            ];
        }, 2000);
    }

    thyDragStart(event: ThyBoardDragStartEvent) {
        console.log(`开始拖动：`, event);
    }

    thyDropEnterPredicate = (event: ThyBoardDragPredicateEvent) => {
        console.log(`判断是否可拖动到：`, event);
        return true;
    };

    thyDropAction = (event: ThyBoardDropActionEvent) => {
        console.log(`拖动到：`, event);
        return of(false).pipe(delay(1000));
    };

    thySortCardsInEntry = (event: ThyBoardSortEvent) => {
        if (event.entry._id === '2') {
            return event.cards.reverse();
        } else {
            return event.cards;
        }
    };
}
