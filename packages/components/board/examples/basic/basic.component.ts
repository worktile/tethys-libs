import { Component, OnInit } from '@angular/core';
import {
    ThyBoardCard,
    ThyBoardDragStartEvent,
    ThyBoardDropActionEvent,
    ThyBoardDragPredicateEvent,
    ThyBoardEntry,
    ThyBoardLane
} from '@tethys/pro/board';
import { entries, items, lanes } from '../mock';
import { delay, of } from 'rxjs';

interface CardInfo extends ThyBoardCard {
    title: string;
}

@Component({
    selector: 'thy-pro-board-basic-example',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss']
})
export class ThyProBoardBasicExampleComponent implements OnInit {
    entries: ThyBoardEntry[] = [...entries];

    items: CardInfo[] = [...(items as CardInfo[])];

    lanes: ThyBoardLane[] = lanes.map((lane, index) => {
        return { ...lane, expanded: (index & 1) === 0 };
    });

    constructor() {}

    ngOnInit(): void {
        console.log(this.lanes);
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

    expandLane(event: { lane: ThyBoardLane; expanded: boolean }) {
        console.log(`${event.lane.name}: ${event.expanded}`);
    }

    expandAllLanes(event: { expanded: boolean }) {
        console.log(`all lanes expanded: ${event.expanded}`);
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
}
