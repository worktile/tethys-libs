import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    booleanAttribute,
    contentChild,
    effect,
    input,
    numberAttribute
} from '@angular/core';
import { ThyBoardVirtualScrolledIndexChangeEvent, ThyBoardCard, ThyBoardEntry, ThyBoardLane } from './entities';
import { ThyBoardHeaderComponent } from './header/header.component';
import { ThyBoardLaneComponent } from './lane/lane.component';
import { ThyBoardEntryComponent } from './entry/entry.component';
import { ThyBoardBodyScrollableDirective } from './scroll/board-body-scroll';
import { ThyBoardService } from './board.service';

@Component({
    selector: 'thy-board',
    templateUrl: 'board.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ThyBoardHeaderComponent, ThyBoardLaneComponent, ThyBoardEntryComponent, ThyBoardBodyScrollableDirective],
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
    @Input({ transform: booleanAttribute }) thyVirtualScroll = false;

    /**
     * 卡片默认高度
     * @default false
     * @type boolean
     */
    @Input({ transform: numberAttribute }) thyDefaultCardSize = 112;

    /**
     * 是否支持排序,开启后支持同栏排序
     * @default false
     * @type boolean
     */
    @Input({ transform: booleanAttribute }) thySortable = false;

    /**
     * 是否支持拖动，变更栏和泳道
     * @default false
     * @type boolean
     */
    @Input({ transform: booleanAttribute }) thyMovable = false;

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

    // @Input() dragStartFn: (card: ThyBoardCard) => Observable<[]>;

    // @Input() dragDropFn: (data: { card: ThyBoardCard }) => Observable<any>;

    /**
     * 开启虚拟滚动后，滚动后触发时间，可用于加载数据
     */
    @Output() thyVirtualScrolledIndexChange = new EventEmitter<ThyBoardVirtualScrolledIndexChangeEvent>();

    /**
     * 展开收起泳道事件
     */
    @Output() thyExpandLane = new EventEmitter<{ lane: ThyBoardLane; expanded: boolean }>();

    /**
     * 展开收起所有泳道事件
     */
    @Output() thyExpandAllLanes = new EventEmitter<{ expanded: boolean }>();

    /**
     * 展开收起栏事件
     */
    @Output() thyExpandEntry = new EventEmitter<{ entry: ThyBoardEntry; expanded: boolean }>();

    /**
     * 拖拽后触发事件
     */
    @Output() thyDroppableChange = new EventEmitter<boolean>();

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
}
