import { Component, OnInit } from '@angular/core';
import { ThyBoardCard, ThyBoardEntry, ThyBoardLane } from '@tethys/pro/board';
import { entries, lanes } from '../mock';

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
        },
        {
            _id: '3',
            title: '项目3',
            laneId: '2',
            entryId: '2'
        },
        {
            _id: '4',
            title: '项目4',
            laneId: '1',
            entryId: '1'
        },
        {
            _id: '5',
            title: '项目5',
            laneId: '1',
            entryId: '1'
        },
        {
            _id: '6',
            title: '项目6',
            laneId: '1',
            entryId: '1'
        }
    ];

    lanes: ThyBoardLane[] = [lanes[0]];

    constructor() {}

    ngOnInit(): void {}
}
