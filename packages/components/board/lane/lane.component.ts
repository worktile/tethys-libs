import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    TemplateRef,
    ViewChildren,
    WritableSignal,
    booleanAttribute,
    effect,
    input,
    numberAttribute,
    signal
} from '@angular/core';
import { ThyBoardEntryComponent } from '../entry/entry.component';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import { ThyBoardEntry, ThyBoardLane } from '../entities';
import { helpers } from 'ngx-tethys/util';

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

    lane = input<ThyBoardLane>();

    entries = input.required<ThyBoardEntry[]>();

    allLanesExpanded = input<boolean>(true);

    @Input({ transform: booleanAttribute }) hasLane = false;

    @Input({ transform: booleanAttribute }) virtualScroll = false;

    @Input() laneTemplateRef: TemplateRef<any> | null = null;

    @Input() cardTemplateRef: TemplateRef<any> | null = null;

    container = input.required<HTMLDivElement>();

    @Input({ transform: numberAttribute }) defaultCardSize = 112;

    /**
     * 展开收起泳道事件
     */
    @Output() expandLane = new EventEmitter<{ lane: ThyBoardLane; expanded: boolean }>();

    laneIsExpanded: WritableSignal<boolean> = signal(true);

    constructor() {
        effect(() => {
            this.setLaneHeight();
        });

        effect(
            () => {
                const lane = this.lane();
                const allLanesExpanded = this.allLanesExpanded();
                if (!helpers.isUndefinedOrNull(lane?.expanded)) {
                    this.laneIsExpanded.set(!!lane?.expanded);
                } else {
                    this.laneIsExpanded.set(allLanesExpanded);
                }
            },
            { allowSignalWrites: true }
        );
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
            laneHeight = this.laneIsExpanded() && this.lane()?.cards?.length === 0 ? emptyLaneHeight : laneHeight;
            this.laneHeight = laneHeight;
        }
    }

    public expand() {
        const isExpanded = this.laneIsExpanded();
        this.lane()!.expanded = !isExpanded;
        this.laneIsExpanded.set(!isExpanded);
        this.expandLane.emit({ lane: this.lane()!, expanded: !isExpanded });
    }
}
