import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
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
    ThyBoardDropEnterPredicateEvent
} from './entities';
import { ThyBoardHeaderComponent } from './header/header.component';
import { ThyBoardLaneComponent } from './lane/lane.component';
import { ThyBoardEntryComponent } from './entry/entry.component';
import { ThyBoardBodyScrollableDirective } from './scroll/board-body-scroll';
import { ThyBoardService } from './board.service';
import { CdkDropListGroup, DragDropModule } from '@angular/cdk/drag-drop';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'thy-board',
    templateUrl: 'board.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CdkDropListGroup,
        DragDropModule,
        ThyBoardHeaderComponent,
        ThyBoardLaneComponent,
        ThyBoardEntryComponent,
        ThyBoardBodyScrollableDirective
    ],
    host: {
        class: 'thy-board-container'
    },
    providers: [ThyBoardService]
})
export class ThyBoardComponent implements OnInit {
    /**
     * 卡片展示模板
     * @type TemplateRef
     */

    cardTemplateRef = contentChild.required<TemplateRef<any>>('card');

    /**
     * 栏展示模板
     * @type TemplateRef
     */
    @ContentChild('lane')
    public laneTemplateRef: TemplateRef<any> | null = null;

    /**
     * header 展示模板
     * @type TemplateRef
     */
    @ContentChild('header')
    public headerTemplateRef: TemplateRef<any> | null = null;

    /**
     * 泳道列表
     * @default []
     * @type ThyBoardLane[]
     */
    thyLanes = input<ThyBoardLane[]>([]);

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
     * 判断是否允许拖起的卡片放到另外位置
     * @type (event: { drag: CdkDrag; drop: CdkDropList }) => boolean
     */
    thyDropEnterPredicate = input<(event: ThyBoardDropEnterPredicateEvent) => boolean>();

    /**
     * 当把卡片拖动到另一个位置时触发
     * @type (event: CdkDragDrop<ThyBoardCard[] | undefined>) => Observable<boolean>
     */
    thyDroppedAction = input<(event: ThyBoardDropActionEvent) => Observable<boolean>>();

    // /**
    //  * 开启虚拟滚动后，滚动后触发时间，可用于加载数据
    //  */
    // thyVirtualScrolledIndexChange = output<ThyBoardVirtualScrolledIndexChangeEvent>();

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
    thyDragStart = output<ThyBoardDragStartEvent>();

    public draggingCard: ThyBoardCard | undefined;

    constructor(
        public elementRef: ElementRef,
        public thyBoardService: ThyBoardService
    ) {
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

    dragCardStarted(event: ThyBoardDragStartEvent) {
        this.draggingCard = event.card;
        this.thyDragStart.emit(event);
    }

    dropListDropped = (event: ThyBoardDropActionEvent) => {
        this.draggingCard = undefined;
        const thyDroppedAction = this.thyDroppedAction();
        if (thyDroppedAction) {
            return thyDroppedAction(event);
        } else {
            return of(true);
        }
    };
}
