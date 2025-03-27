import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    TemplateRef,
    booleanAttribute,
    contentChild,
    effect,
    input,
    numberAttribute,
    output
} from '@angular/core';
import {
    ThyBoardCard,
    ThyBoardEntry,
    ThyBoardLane,
    ThyBoardDragScopeType,
    ThyBoardDropActionEvent,
    ThyBoardDragStartEvent,
    ThyBoardDragPredicateEvent,
    ThyBoardZone,
    ThyBoardVirtualScrolledIndexChangeEvent,
    ThyBoardSortEvent
} from './entities';
import { ThyBoardHeaderComponent } from './header/header.component';
import { ThyBoardLaneComponent } from './lane/lane.component';
import { ThyBoardBodyScrollableDirective } from './scroll/board-body-scroll';
import { ThyBoardService } from './board.service';
import { CdkDrag, CdkDropListGroup, DragDropModule, DragDropRegistry } from '@angular/cdk/drag-drop';
import { Observable, of } from 'rxjs';
import { SafeAny } from 'ngx-tethys/types';
import { ThyBoardSkeletonComponent } from './skeleton/skeleton.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { ThyDragDropRegistry } from './scroll/drag-drop-registry';

@Component({
    selector: 'thy-board',
    templateUrl: 'board.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CdkDropListGroup,
        DragDropModule,
        ThyBoardHeaderComponent,
        ThyBoardLaneComponent,
        ThyBoardBodyScrollableDirective,
        ThyBoardSkeletonComponent
    ],
    hostDirectives: [CdkScrollable],
    host: {
        class: 'thy-board'
    },
    providers: [
        ThyBoardService,
        {
            provide: DragDropRegistry,
            useClass: ThyDragDropRegistry
        }
    ]
})
export class ThyBoardComponent implements OnInit {
    /**
     * 卡片展示模板
     * @type TemplateRef
     */

    cardTemplateRef = contentChild.required<TemplateRef<SafeAny>>('card');

    /**
     * 栏展示模板
     * @type TemplateRef
     */
    laneTemplateRef = contentChild<TemplateRef<SafeAny>>('lane');

    /**
     * header 展示模板
     * @type TemplateRef
     */
    headerTemplateRef = contentChild<TemplateRef<SafeAny>>('header');

    /**
     * entry 顶部展示模板
     * @type TemplateRef
     */
    entryTopTemplateRef = contentChild<TemplateRef<SafeAny>>('entryTop');

    /**
     * entry 底部展示模板
     * @type TemplateRef
     */
    entryBottomTemplateRef = contentChild<TemplateRef<SafeAny>>('entryBottom');

    /**
     * 泳道列表
     * @default []
     * @type ThyBoardLane[]
     */
    thyLanes = input<ThyBoardLane[]>([]);

    /**
     * 是否自动将未在任何泳道的数据归类到“未分组”泳道中
     * @default true
     * @type boolean
     */
    thyHasAutoEmptyLane = input(true, { transform: booleanAttribute });

    /**
     * 栏列表
     * @type ThyBoardEntry[]
     */
    thyEntries = input.required<ThyBoardEntry[]>();

    /**
     * 卡片列表
     * @type ThyBoardCard[]
     */
    thyCards = input.required<ThyBoardCard[]>();

    /**
     * 是否展示泳道
     * @default false
     * @type boolean
     */
    thyShowLane = input<boolean>(false);

    /**
     * 是否开启虚拟滚动
     * @default false
     * @type boolean
     */
    thyVirtualScroll = input(false, { transform: booleanAttribute });

    /**
     * 卡片默认高度
     * @default false
     * @type boolean
     */
    thyDefaultCardSize = input(112, { transform: numberAttribute });

    /**
     * 是否支持排序,开启后支持同栏排序
     * @type ThyBoardDragScopeType
     */
    thySortable = input<ThyBoardDragScopeType>();

    /**
     * 是否支持拖动，变更栏和泳道
     * @type ThyBoardDragScopeType
     */
    thyMovable = input<ThyBoardDragScopeType>();

    /**
     * 是否展开所有泳道
     * @default true
     * @type boolean
     */
    thyAllLanesExpanded = input(true, { transform: booleanAttribute });

    /**
     * 是否支持栏的收起展开
     * @default false
     * @type boolean
     */
    thyEntryCollapsible = input(false, { transform: booleanAttribute });

    /**
     * 在构建数据时，对栏中数据进行排序
     */
    thySortCardsInEntry = input<(event: ThyBoardSortEvent) => ThyBoardCard[]>((event: ThyBoardSortEvent) => event.cards);

    /**
     * 获取卡片可放置的区域
     * @type
     */
    thyCardDroppableZonesAction = input<
        (event: ThyBoardDragStartEvent) => Observable<
            {
                laneId?: string;
                entryId: string;
                droppableZones: ThyBoardZone[];
            }[]
        >
    >();

    /**
     * 判断是否允许卡片拖动
     * @type (event: ThyBoardDragPredicateEvent) => boolean
     */
    thyCardDraggablePredicate = input<(event: ThyBoardDragPredicateEvent) => boolean>();

    /**
     * 判断是否允许拖起的卡片放到另外位置
     * @type (event: ThyBoardDragPredicateEvent) => boolean
     */
    thyCardDropEnterPredicate = input<(event: ThyBoardDragPredicateEvent) => boolean>();

    /**
     * 当把卡片拖动到另一个位置时触发
     * @type (event: CdkDragDrop<ThyBoardCard[] | undefined>) => Observable<boolean>
     */
    thyCardDropAction = input<(event: ThyBoardDropActionEvent) => Observable<boolean>>();

    /**
     * 开启虚拟滚动后，滚动后触发时间，可用于加载数据
     */
    thyVirtualScrolledIndexChange = output<ThyBoardVirtualScrolledIndexChangeEvent>();

    /**
     * 展开收起泳道事件
     * @type { lane: ThyBoardLane; expanded: boolean }
     */
    thyExpandLane = output<{ lane: ThyBoardLane; expanded: boolean }>();

    /**
     * 展开收起所有泳道事件
     * @type { expanded: boolean }
     */
    thyExpandAllLanes = output<{ expanded: boolean }>();

    /**
     * 展开收起栏事件
     * @type { entry: ThyBoardEntry; expanded: boolean }
     */
    thyExpandEntry = output<{ entry: ThyBoardEntry; expanded: boolean }>();

    /**
     * 拖起卡片后触发事件
     * @type ThyBoardCard
     */
    thyCardDragStart = output<ThyBoardDragStartEvent>();

    public cardDroppableZones:
        | {
              laneId?: string;
              entryId: string;
              droppableZones: ThyBoardZone[];
          }[]
        | undefined;

    public draggingCard: CdkDrag<ThyBoardCard> | undefined;

    constructor(
        public elementRef: ElementRef,
        public thyBoardService: ThyBoardService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        effect(() => {
            if (this.thyMovable() && this.thySortable()) {
                throw new Error(`thyMovable and thySortable cannot be set values simultaneously..`);
            }
        });

        effect(
            () => {
                this.thyBoardService.setCards(this.thyCards());
            },
            { allowSignalWrites: true }
        );

        effect(
            () => {
                this.thyBoardService.setEntities(this.thyEntries());
            },
            { allowSignalWrites: true }
        );

        effect(
            () => {
                this.thyBoardService.setLanes(this.thyLanes());
            },
            { allowSignalWrites: true }
        );

        effect(
            () => {
                this.thyBoardService.setAllLanesExpanded(this.thyAllLanesExpanded());
            },
            { allowSignalWrites: true }
        );

        effect(
            () => {
                this.thyBoardService.setInnerEntryCollapsible(this.thyEntryCollapsible());
            },
            { allowSignalWrites: true }
        );

        effect(
            () => {
                this.thyBoardService.setHasAutoEmptyLane(this.thyHasAutoEmptyLane());
            },
            { allowSignalWrites: true }
        );

        effect(
            () => {
                this.thyBoardService.setSortCardsInEntry(this.thySortCardsInEntry());
            },
            { allowSignalWrites: true }
        );
    }

    ngOnInit() {}

    expandAllLanes(event: boolean) {
        this.thyBoardService.expandAllLanes(event);
        this.thyExpandAllLanes.emit({ expanded: event });
    }

    expandLane(event: { lane: ThyBoardLane; expanded: boolean }) {
        this.thyBoardService.expandLane(event);
        this.thyExpandLane.emit({ lane: { ...event.lane, expanded: event.expanded }, expanded: event.expanded });
    }

    expandEntry(event: { entry: ThyBoardEntry; expanded: boolean }) {
        this.thyBoardService.expandEntry(event);
        this.thyExpandEntry.emit({ entry: { ...event.entry, expanded: event.expanded }, expanded: event.expanded });
    }

    dragCardStarted(event: CdkDrag<ThyBoardCard>) {
        this.draggingCard = event;
        this.thyCardDragStart.emit({ card: event.data });
        const thyCardDroppableZonesAction = this.thyCardDroppableZonesAction();
        if (thyCardDroppableZonesAction) {
            thyCardDroppableZonesAction({ card: event.data })
                .pipe()
                .subscribe((data) => {
                    this.cardDroppableZones = data;
                    this.changeDetectorRef.markForCheck();
                });
        }
    }

    dropListDropped = (event: ThyBoardDropActionEvent) => {
        this.cardDroppableZones = undefined;
        this.draggingCard = undefined;
        const thyCardDropAction = this.thyCardDropAction();
        this.changeDetectorRef.markForCheck();
        if (thyCardDropAction) {
            return thyCardDropAction(event);
        } else {
            return of(true);
        }
    };
}
