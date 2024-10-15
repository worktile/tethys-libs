import { Component, OnInit } from '@angular/core';
import { ThyBoardCard, ThyBoardEntry, ThyBoardLane } from '@tethys/pro/board';
import { entries, items, lanes } from '../mock';

interface CardInfo extends ThyBoardCard {
    title: string;
}

@Component({
    selector: 'thy-pro-board-custom-template-example',
    templateUrl: './custom-template.component.html',
    styleUrls: ['./custom-template.component.scss']
})
export class ThyProBoardCustomTemplateExampleComponent implements OnInit {
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

    clickBottom(entry: ThyBoardEntry) {
        this.bottomHeights[entry._id].bottom = this.bottomHeights[entry._id].bottom === 22 ? 100 : 22;
    }

    clickTop(entry: ThyBoardEntry) {
        this.bottomHeights[entry._id].top = this.bottomHeights[entry._id].top === 22 ? 100 : 22;
    }
}
