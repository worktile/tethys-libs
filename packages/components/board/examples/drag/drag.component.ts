import { Component, OnInit } from '@angular/core';
import {
    ThyBoardCard,
    ThyBoardDragPredicateEvent,
    ThyBoardDragStartEvent,
    ThyBoardDropActionEvent,
    ThyBoardEntry,
    ThyBoardLane
} from '@tethys/pro/board';
import { delay, map, of, tap } from 'rxjs';
import { entries, items, lanes } from '../mock';

interface CardInfo extends ThyBoardCard {
    title: string;
}

@Component({
    selector: 'thy-pro-board-drag-example',
    templateUrl: './drag.component.html',
    styleUrls: ['./drag.component.scss'],
    standalone: false
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
        // console.log(`判断是否可拖动：`, event);
        return event.card._id !== '0';
    };

    thyDragStart(event: ThyBoardDragStartEvent) {
        console.log(`开始拖动：`, event);
    }

    thyDropEnterPredicate = (event: ThyBoardDragPredicateEvent) => {
        // console.log(`判断是否可拖动到：`, event);
        return true;
    };

    thyDropAction = (event: ThyBoardDropActionEvent) => {
        console.log(`拖动到：`, event);

        return of(true).pipe(
            tap((value) => {
                if (value) {
                    this.items = this.items.map((item) => {
                        if (item._id === event.card._id) {
                            const laneIds = item.laneIds.filter((id) => id !== event.previousContainer.lane?._id);
                            if (event.container.lane?._id) {
                                laneIds.push(event.container.lane?._id);
                            }

                            const entryIds = item.entryIds.filter((id) => id !== event.previousContainer.entry?._id);
                            if (event.container.entry?._id) {
                                entryIds.push(event.container.entry?._id);
                            }
                            return {
                                ...item,
                                laneIds: laneIds,
                                entryIds: entryIds
                            };
                        } else {
                            return item;
                        }
                    });
                }
            }),
            delay(1000)
        );
    };

    thyCardDroppableZonesAction = (event: ThyBoardDragPredicateEvent) => {
        return of(true).pipe(
            map(() => {
                const zones: { laneId: string; entryId: string; droppableZones: { _id: string; name: string }[] }[] = [];
                this.lanes.forEach((lane) => {
                    this.entries.forEach((entry) => {
                        zones.push({
                            laneId: lane._id,
                            entryId: entry._id,
                            droppableZones: entry._id !== '3' ? entry.droppableZones! : []
                        });
                    });
                });
                return zones;
            }),
            delay(1000)
        );
    };
}
