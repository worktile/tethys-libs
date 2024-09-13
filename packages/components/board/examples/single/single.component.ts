import { Component, OnInit } from '@angular/core';
import { ThyBoardCard, ThyBoardDragStartEvent, ThyBoardDropActionEvent, ThyBoardDropEnterPredicateEvent, ThyBoardEntry, ThyBoardLane } from '@tethys/pro/board';
import { entries, items, lanes } from '../mock';
import { delay, of } from 'rxjs';

interface CardInfo extends ThyBoardCard {
    title: string;
}

@Component({
    selector: 'thy-pro-board-single-example',
    templateUrl: './single.component.html',
    styleUrls: ['./single.component.scss']
})
export class ThyProBoardSingleExampleComponent implements OnInit {
    entries: ThyBoardEntry[] = [...entries];

    items: CardInfo[] = items as CardInfo[];

    lanes: ThyBoardLane[] = [lanes[0]];

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

    thyDropEnterPredicate = (event: ThyBoardDropEnterPredicateEvent) => {
        console.log(`判断是否可拖动到：`, event);
        return true;
    };

    thyDropAction = (event: ThyBoardDropActionEvent) => {
        console.log(`拖动到：`, event);
        return of(false).pipe(delay(1000));
    };
}
