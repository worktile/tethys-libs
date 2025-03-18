import { Component, OnInit, input } from '@angular/core';
import { ThyBoardCard } from '@tethys/pro/board';

interface CardInfo extends ThyBoardCard {
    title: string;
}

@Component({
    selector: 'thy-board-basic-card',
    templateUrl: './card.component.html',
    host: {
        class: 'card-container'
    },
    standalone: false
})
export class ThyBoardBasicCardComponent implements OnInit {
    card = input.required<CardInfo>();

    constructor() {}

    ngOnInit() {}
}
