import { Component, OnInit } from '@angular/core';
import {
    ThyBoardCard,
    ThyBoardDragPredicateEvent,
    ThyBoardDragStartEvent,
    ThyBoardDropActionEvent,
    ThyBoardEntry,
    ThyBoardLane
} from '@tethys/pro/board';
import { delay, of } from 'rxjs';
import { entries, items, lanes } from '../mock';

interface CardInfo extends ThyBoardCard {
    title: string;
}

@Component({
    selector: 'thy-pro-board-virtual-scroll-example',
    templateUrl: './virtual-scroll.component.html',
    styleUrls: ['./virtual-scroll.component.scss'],
    standalone: false
})
export class ThyProBoardVirtualScrollExampleComponent implements OnInit {
    entries: ThyBoardEntry[] = [...entries];

    items: CardInfo[] = [...(items as CardInfo[])];

    lanes: ThyBoardLane[] = [...lanes];

    thyShowLane = true;

    constructor() {}

    ngOnInit(): void {
        setTimeout(() => {
            this.items = [
                ...this.items,
                {
                    _id: 'add',
                    title: '项目add',
                    laneIds: ['1'],
                    entryIds: ['3'],
                    height: Math.floor(Math.random() * 100 + 100)
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
        return of(true).pipe(delay(1000));
    };
}
