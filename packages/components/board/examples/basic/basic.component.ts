import { Component, OnInit } from '@angular/core';
import { ThyBoardCard, ThyBoardEntry, ThyBoardLane } from '@tethys/pro/board';
import { entries, items, lanes } from '../mock';

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

    lanes: ThyBoardLane[] = [...lanes];

    constructor() {}

    ngOnInit(): void {}
}
