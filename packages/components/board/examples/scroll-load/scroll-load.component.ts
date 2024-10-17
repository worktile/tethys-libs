import { Component, OnInit } from '@angular/core';
import {
    ThyBoardCard,
    ThyBoardDragStartEvent,
    ThyBoardDropActionEvent,
    ThyBoardDragPredicateEvent,
    ThyBoardEntry,
    ThyBoardLane,
    ThyBoardVirtualScrolledIndexChangeEvent
} from '@tethys/pro/board';
import { entries, items, lanes } from '../mock';
import { delay, of } from 'rxjs';

interface CardInfo extends ThyBoardCard {
    title: string;
}

@Component({
    selector: 'thy-pro-board-scroll-load-example',
    templateUrl: './scroll-load.component.html',
    styleUrls: ['./scroll-load.component.scss']
})
export class ThyProBoardScrollLoadExampleComponent implements OnInit {
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

    generateRandomItems(length: number, event: ThyBoardVirtualScrolledIndexChangeEvent) {
        const items = [];
        for (let i = 0; i < length; i++) {
            const title = event.lane
                ? `泳道:${event.lane?.name}-栏:${event.entry?.name}-项目${(event.entry.cards?.length || 0) + i}`
                : `栏:${event.entry?.name}-项目${(event.entry.cards?.length || 0) + i}`;
            items.push({
                _id: `${Math.floor(Math.random() * 100000000)}`,
                title: title,
                laneIds: [`${event.lane?._id}`],
                entryIds: [`${event.entry._id}`],
                height: Math.floor(Math.random() * 100 + 100)
            });
        }
        return items;
    }

    thyVirtualScrolledIndexChange(event: ThyBoardVirtualScrolledIndexChangeEvent) {
        console.log(event);
        // 检查滚动位置是否接近列表底部
        if (event.renderedRange.end + 10 >= event.entry.cards!.length && event.entry.cards!.length < 100) {
            // 加载更多数据
            const items = this.generateRandomItems(10, event);
            of(items).subscribe(() => {
                this.items = [...this.items, ...items];
            });
        }
    }
}
