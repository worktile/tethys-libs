import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnInit,
    QueryList,
    TemplateRef,
    ViewChildren,
    booleanAttribute,
    effect,
    input,
    numberAttribute
} from '@angular/core';
import { ThyBoardEntryComponent } from '../entry/entry.component';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import { ThyBoardEntry, ThyBoardLane } from '../entities';

const emptyLaneHeight = 200;

@Component({
    selector: 'thy-board-lane',
    templateUrl: 'lane.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgStyle, NgClass, NgTemplateOutlet, ThyIcon, ThyFlexibleText, ThyBoardEntryComponent],
    host: {
        class: 'thy-board-lane-container'
    }
})
export class ThyBoardLaneComponent implements OnInit {
    @ViewChildren(ThyBoardEntryComponent) entryComponents!: QueryList<ThyBoardEntryComponent>;

    public isBatchOperation = false;

    public swimlaneLength = 0;

    public laneHeight = 0;

    @Input() lane: ThyBoardLane | undefined;

    entries = input.required<ThyBoardEntry[]>();

    @Input({ transform: booleanAttribute }) isExpanded = true;

    @Input({ transform: booleanAttribute }) hasLane = false;

    @Input({ transform: booleanAttribute }) virtualScroll = false;

    @Input() laneTemplateRef: TemplateRef<any> | null = null;

    @Input() cardTemplateRef: TemplateRef<any> | null = null;

    container = input.required<HTMLDivElement>();

    @Input({ transform: numberAttribute }) defaultCardSize = 112;

    constructor() {
        effect(() => {
            this.setLaneHeight();
        });
    }

    ngOnInit() {}

    private setLaneHeight() {
        if (this.entryComponents?.toArray().length > 0 && this.hasLane && this.virtualScroll) {
            let laneHeight = 0;
            this.entryComponents.toArray().forEach((entry, index) => {
                let entrySpacer = entry.entryVirtualScroll?.scrollStrategy?.entrySpacer();
                entrySpacer = entrySpacer < entry.entryBodyHeight ? entry.entryBodyHeight : entrySpacer;
                laneHeight = Math.max(laneHeight, entrySpacer);
            });
            laneHeight = this.isExpanded && this.lane?.cards?.length === 0 ? emptyLaneHeight : laneHeight;
            this.laneHeight = laneHeight;
        }
    }

    public expand() {
        this.isExpanded = !this.isExpanded;
    }
}
