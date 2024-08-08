import { Component, OnInit } from '@angular/core';
import { ThyBoardCard, ThyBoardEntry, ThyBoardLane } from '@tethys/pro/board';
import { entries, items, lanes } from '../mock';
import { helpers } from 'ngx-tethys/util';

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
    }

    expandLane(event: { lane: ThyBoardLane; expanded: boolean }) {
        console.log(`${event.lane.name}: ${event.expanded}`);
    }

    expandAllLanes(event: { expanded: boolean }) {
        console.log(`all lanes expanded: ${event.expanded}`);
    }
}
