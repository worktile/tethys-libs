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
    booleanAttribute,
    effect,
    input,
    numberAttribute,
    output
} from '@angular/core';
import { ThyBoardEntryComponent } from '../entry/entry.component';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import {
    ThyBoardDropEnterPredicateEvent,
    ThyBoardEntry,
    ThyBoardLane,
    ThyBoardDragScopeType,
    ThyBoardCard,
    ThyBoardDropActionEvent
} from '../entities';
import { CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';
import { Observable, of } from 'rxjs';

const emptyLaneHeight = 200;

@Component({
    selector: 'thy-board-lane',
    templateUrl: 'lane.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgStyle, NgClass, NgTemplateOutlet, DragDropModule, ThyIcon, ThyFlexibleText, ThyBoardEntryComponent],
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
     * 是否支持栏的收起展开
     * @default false
     * @type boolean
     */
    laneCollapsible = input(true, { transform: booleanAttribute });

    /**
     * 是否支持排序,开启后支持同栏排序
     * @default false
     * @type boolean
     */
    sortable = input<ThyBoardDragScopeType>();

    /**
     * 是否支持拖动，变更栏和泳道
     * @default false
     * @type boolean
     */
    movable = input<ThyBoardDragScopeType>();

    draggingCard = input<CdkDrag<ThyBoardCard>>();

    @Input() cardDropEnterPredicate: ((event: ThyBoardDropEnterPredicateEvent) => boolean) | undefined;

    @Input() cardDropAction: ((event: ThyBoardDropActionEvent) => Observable<boolean>) | undefined;

    cardDragStarted = output<CdkDrag<ThyBoardCard>>();
    /**
     * 展开收起泳道事件
     */
    @Output() expandLane = new EventEmitter<{ lane: ThyBoardLane; expanded: boolean }>();

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
            laneHeight = this.lane()?.expanded && this.lane()?.cards?.length === 0 ? emptyLaneHeight : laneHeight;
            this.laneHeight = laneHeight;
        }
    }

    public expand() {
        const isExpanded = this.lane()?.expanded;
        this.expandLane.emit({ lane: this.lane()!, expanded: !isExpanded });
    }

    dropListDropped = (event: ThyBoardDropActionEvent) => {
        if (this.cardDropAction) {
            return this.cardDropAction(event);
        } else {
            return of(true);
        }
    };
}
