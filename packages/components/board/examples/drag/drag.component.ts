import { Component, OnInit } from '@angular/core';
import {
    ThyBoardCard,
    ThyBoardDragPredicateEvent,
    ThyBoardDragStartEvent,
    ThyBoardDropActionEvent,
    ThyBoardEntry,
    ThyBoardLane
} from '@tethys/pro/board';
import { entries, items, lanes } from '../mock';
import { delay, of } from 'rxjs';

interface CardInfo extends ThyBoardCard {
    title: string;
}

@Component({
    selector: 'thy-pro-board-drag-example',
    templateUrl: './drag.component.html',
    styleUrls: ['./drag.component.scss']
})
export class ThyProBoardDragExampleComponent implements OnInit {
    entries: ThyBoardEntry[] = [...entries];

    items: CardInfo[] = [
        {
            _id: '0',
            title: '项目0(不可拖动)',
            laneIds: ['1'],
            entryIds: ['1']
        },
        ...(items as CardInfo[])
    ];

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

    thyCardDraggablePredicate = (event: ThyBoardDragPredicateEvent) => {
        console.log(`判断是否可拖动：`, event);
        return event.card._id !== '0';
    };

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
}
