import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    TemplateRef,
    booleanAttribute,
    effect,
    input,
    numberAttribute,
    output,
    viewChildren
} from '@angular/core';
import { ThyBoardEntryComponent } from '../entry/entry.component';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import {
    ThyBoardDragPredicateEvent,
    ThyBoardEntry,
    ThyBoardLane,
    ThyBoardDragScopeType,
    ThyBoardCard,
    ThyBoardDropActionEvent,
    ThyBoardZone,
    ThyBoardVirtualScrolledIndexChangeEvent
} from '../entities';
import { CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';
import { Observable, of } from 'rxjs';
import { SafeAny } from 'ngx-tethys/types';

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
    entryComponents = viewChildren(ThyBoardEntryComponent);

    public isBatchOperation = false;

    public swimlaneLength = 0;

    public laneHeight = 0;

    lane = input<ThyBoardLane>();

    entries = input.required<ThyBoardEntry[]>();

    allLanesExpanded = input<boolean>(true);

    hasLane = input(false, { transform: booleanAttribute });

    virtualScroll = input(false, { transform: booleanAttribute });

    laneTemplateRef = input<TemplateRef<SafeAny>>();

    cardTemplateRef = input.required<TemplateRef<SafeAny>>();

    container = input.required<HTMLDivElement>();

    entryTopTemplateRef = input<TemplateRef<SafeAny>>();

    entryBottomTemplateRef = input<TemplateRef<SafeAny>>();

    defaultCardSize = input(112, { transform: numberAttribute });

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

    hasDroppableZones = input<boolean>();

    /**
     * 获取卡片可放置的区域
     */
    cardDroppableZones = input<
        {
            laneId?: string;
            entryId: string;
            droppableZones: ThyBoardZone[];
        }[]
    >();

    cardDraggablePredicate = input<(event: ThyBoardDragPredicateEvent) => boolean>();

    cardDropEnterPredicate = input<(event: ThyBoardDragPredicateEvent) => boolean>();

    cardDropAction = input<(event: ThyBoardDropActionEvent) => Observable<boolean>>();

    cardDragStarted = output<CdkDrag<ThyBoardCard>>();
    /**
     * 展开收起泳道事件
     */
    expandLane = output<{ lane: ThyBoardLane; expanded: boolean }>();

    virtualScrolledIndexChange = output<ThyBoardVirtualScrolledIndexChangeEvent>();

    constructor() {
        effect(() => {
            this.setLaneHeight();
        });
    }

    ngOnInit() {}

    private setLaneHeight() {
        if (this.entryComponents()?.length > 0 && this.hasLane() && this.virtualScroll()) {
            let laneHeight = 0;
            this.entryComponents().forEach((entry, index) => {
                let entrySpacer = entry.entryComponent()!.entryRealHeight();
                entrySpacer = entrySpacer < entry.entryComponent()!.entryBodyHeight ? entry.entryComponent()!.entryBodyHeight : entrySpacer;
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
        const cardDropAction = this.cardDropAction();
        if (cardDropAction) {
            return cardDropAction(event);
        } else {
            return of(true);
        }
    };
}
