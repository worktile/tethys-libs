import { Component, OnInit } from '@angular/core';
import { ThyBoardCard, ThyBoardDragPredicateEvent, ThyBoardDragStartEvent, ThyBoardDropActionEvent, ThyBoardEntry, ThyBoardLane } from '@tethys/pro/board';
import { entries, items, lanes } from '../mock';
import { delay, of } from 'rxjs';

interface CardInfo extends ThyBoardCard {
    title: string;
}

@Component({
    selector: 'thy-pro-board-sortable-example',
    templateUrl: './sortable.component.html',
    styleUrls: ['./sortable.component.scss']
})
export class ThyProBoardSortableExampleComponent implements OnInit {
    entries: ThyBoardEntry[] = [...entries];

    items: CardInfo[] = [...(items as CardInfo[])];

    lanes: ThyBoardLane[] = [...lanes];

    bottomHeights: Record<string, { top: number; bottom: number }> = {};

    constructor() {}

    ngOnInit(): void {
        entries.forEach((entry) => {
            this.bottomHeights[entry._id] = { top: 22, bottom: 22 };
        });

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
        // console.log(`判断是否可拖动到：`, event);
        return event.container.entry._id !== '2';
    };

    thyDropAction = (event: ThyBoardDropActionEvent) => {
        console.log(`拖动到：`, event);
        return of(false).pipe(delay(1000));
    };
    
    clickBottom(entry: ThyBoardEntry) {
        this.bottomHeights[entry._id].bottom = this.bottomHeights[entry._id].bottom === 22 ? 100 : 22;
    }

    clickTop(entry: ThyBoardEntry) {
        this.bottomHeights[entry._id].top = this.bottomHeights[entry._id].top === 22 ? 100 : 22;
    }
}
