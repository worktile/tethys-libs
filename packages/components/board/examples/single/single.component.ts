import { Component, OnInit } from '@angular/core';
import { ThyBoardCard, ThyBoardEntry, ThyBoardLane } from '@tethys/pro/board';
import { entries, items, lanes } from '../mock';

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

    ngOnInit(): void {}
}
