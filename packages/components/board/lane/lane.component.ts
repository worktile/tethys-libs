import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef, booleanAttribute, input } from '@angular/core';
import { ThyBoardEntryComponent } from '../entry/entry.component';
import { NgClass, NgFor, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import { ThyBoardEntry, ThyBoardLane } from '../entities';

@Component({
    selector: 'thy-board-lane',
    templateUrl: 'lane.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass, NgIf, NgFor, NgForOf, NgTemplateOutlet, ThyIcon, ThyFlexibleText, ThyBoardEntryComponent],
    host: {
        class: 'thy-board-lane-container'
    }
})
export class ThyBoardLaneComponent implements OnInit {
    public isBatchOperation = false;

    public swimlaneLength = 0;

    @Input() lane: ThyBoardLane | undefined;

    entries = input.required<ThyBoardEntry[]>();

    @Input({ transform: booleanAttribute }) isExpanded = true;

    @Input({ transform: booleanAttribute }) hasLane = false;

    @Input() laneTemplateRef: TemplateRef<any> | null = null;

    @Input() cardTemplateRef: TemplateRef<any> | null = null;

    constructor() {}

    ngOnInit() {}

    public switchSwimlaneExpand() {}

    public expand() {
        this.isExpanded = !this.isExpanded;
    }
}
