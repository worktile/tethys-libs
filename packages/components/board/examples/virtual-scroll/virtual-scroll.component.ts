import { Component, OnInit } from '@angular/core';
import {
    ThyBoardCard,
    ThyBoardDragStartEvent,
    ThyBoardDropActionEvent,
    ThyBoardDropEnterPredicateEvent,
    ThyBoardEntry,
    ThyBoardLane
} from '@tethys/pro/board';
import { entries, items, lanes } from '../mock';
import { delay, of } from 'rxjs';

interface CardInfo extends ThyBoardCard {
    title: string;
}

@Component({
    selector: 'thy-pro-board-virtual-scroll-example',
    templateUrl: './virtual-scroll.component.html',
    styleUrls: ['./virtual-scroll.component.scss']
})
export class ThyProBoardVirtualScrollExampleComponent implements OnInit {
    entries: ThyBoardEntry[] = [...entries];

    items: CardInfo[] = [...(items as CardInfo[])];

    lanes: ThyBoardLane[] = [...lanes];

    thyShowLane = true;

    constructor() {}

    ngOnInit(): void {}

    thyDragStart(event: ThyBoardDragStartEvent) {
        console.log(`开始拖动：`, event);
    }

    thyDropEnterPredicate = (event: ThyBoardDropEnterPredicateEvent) => {
        console.log(`判断是否可拖动到：`, event);
        return true;
    };

    thyDropAction = (event: ThyBoardDropActionEvent) => {
        console.log(`拖动到：`, event);
        return of(true).pipe(delay(1000));
    };
}
