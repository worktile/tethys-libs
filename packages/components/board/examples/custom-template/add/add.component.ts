import { Component, HostBinding, OnInit, input } from '@angular/core';
import { ThyBoardCard } from '@tethys/pro/board';

interface CardInfo extends ThyBoardCard {
    title: string;
}

@Component({
    selector: 'thy-board-custom-template-add',
    templateUrl: './add.component.html',
    host: {
        class: 'card-add-container'
    },
    standalone: false
})
export class ThyBoardCustomTemplateAddComponent implements OnInit {
    @HostBinding('class.card-add-container--creating') isCreating = false;

    isAdded = false;

    constructor() {}

    ngOnInit() {}

    goAddStep() {
        this.isAdded = true;
        this.isCreating = true;
    }

    create(event: Event) {
        this.isAdded = false;
        this.isCreating = false;
    }

    cancel() {
        this.isAdded = false;
        this.isCreating = false;
    }
}
