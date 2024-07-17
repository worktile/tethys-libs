import { Component, OnInit } from '@angular/core';
import { ThyBoardCard, ThyBoardEntry, ThyBoardLane } from '@tethys/pro/board';
import { entries, items, lanes } from '../mock';

interface CardInfo extends ThyBoardCard {
    title: string;
}

@Component({
    selector: 'thy-pro-board-manual-lane-example',
    templateUrl: './manual-lane.component.html',
    styleUrls: ['./manual-lane.component.scss']
})
export class ThyProBoardManualLaneExampleComponent implements OnInit {
    entries: ThyBoardEntry[] = [...entries];

    items: CardInfo[] = [
        {
            _id: '1',
            title: '项目1-1',
            laneId: '1',
            entryId: '1'
        },
        {
            _id: '2',
            title: '项目2',
            laneId: '1',
            entryId: '1'
        }
    ];

    lanes: ThyBoardLane[] = [lanes[0]];

    constructor() {}

    ngOnInit(): void {}
}
