import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    EventEmitter,
    Input,
    OnInit,
    Output,
    Signal,
    TemplateRef,
    booleanAttribute,
    computed,
    contentChild,
    input
} from '@angular/core';
import { ThyBoardVirtualScrolledIndexChangeEvent, ThyBoardCard, ThyBoardEntry, ThyBoardLane } from './entities';
import { ThyBoardHeaderComponent } from './header/header.component';
import { ThyBoardLaneComponent } from './lane/lane.component';
import { ThyBoardEntryComponent } from './entry/entry.component';
import { EMPTY_OBJECT_ID_STR } from './constants';

@Component({
    selector: 'thy-board',
    templateUrl: 'board.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ThyBoardHeaderComponent, ThyBoardLaneComponent, ThyBoardEntryComponent],
    host: {
        class: 'thy-board-container'
    }
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

    // @Input() dragStartFn: (card: ThyBoardCard) => Observable<[]>;

    // @Input() dragDropFn: (data: { card: ThyBoardCard }) => Observable<any>;

    /**
     * 开启虚拟滚动后，滚动后触发时间，可用于加载数据
     */
    @Output() virtualScrolledIndexChange = new EventEmitter<ThyBoardVirtualScrolledIndexChangeEvent>();

    /**
     * 展开收起泳道事件
     */
    @Output() expandLane = new EventEmitter<{ lane: ThyBoardLane; expanded: boolean }>();

    /**
     * 拖拽后触发事件
     */
    @Output() droppableChange = new EventEmitter<boolean>();

    public isExpandAll = true;

    public lanesWithEntriesAndCards: Signal<ThyBoardLane[]> = computed(() => {
        const entries = this.thyEntries();
        const cards = this.thyCards();
        const lanes = this.thyLanes();

        return this.buildLanesWithEntriesAndCards(lanes, entries, cards);
    });

    public entriesWithCards: Signal<ThyBoardEntry[]> = computed(() => {
        const lanesWithEntriesAndCards = this.lanesWithEntriesAndCards();
        const entries = this.thyEntries();
        return this.buildEntriesWithCardsByLanes(lanesWithEntriesAndCards, entries);
    });

    constructor() {}

    ngOnInit() {}

    private buildCardsMap(cards: ThyBoardCard[]): Record<string, ThyBoardCard[]> {
        const cardsMapByEntryId: Record<string, ThyBoardCard[]> = {};

        (cards || []).forEach((card) => {
            cardsMapByEntryId[card.entryId] = cardsMapByEntryId[card.entryId] ? cardsMapByEntryId[card.entryId].concat([card]) : [card];
        });
        return cardsMapByEntryId;
    }

    private buildEntriesWithCardsByLanes(lanes: ThyBoardLane[], entries: ThyBoardEntry[]) {
        const entriesMapById: Record<string, ThyBoardEntry> = {};
        (entries || []).forEach((entry) => {
            entriesMapById[entry._id] = entry;
            entriesMapById[entry._id].cards = [];
        });
        (lanes || []).forEach((lane) => {
            lane.entries!.forEach((entry) => {
                entriesMapById[entry._id].cards = (entriesMapById[entry._id].cards || []).concat(entry.cards || []);
            });
        });

        return entries;
    }

    private buildEntriesWithCards(cards: ThyBoardCard[], entries: ThyBoardEntry[]) {
        const cardsMapByEntryId = this.buildCardsMap(cards);

        return (entries || []).map((entry) => {
            return {
                ...entry,
                cards: cardsMapByEntryId[entry._id] || []
            };
        });
    }

    private buildLanesWithEntriesAndCards(lanes: ThyBoardLane[], entries: ThyBoardEntry[], cards: ThyBoardCard[]) {
        const unGroup: ThyBoardLane = {
            _id: EMPTY_OBJECT_ID_STR,
            name: '未分组',
            cards: []
        };

        const lanesMapById: Record<string, ThyBoardLane> = {};
        (lanes || []).forEach((lane) => {
            lane.cards = [];
            lanesMapById[lane._id] = lane;
        });

        (cards || []).forEach((card) => {
            let lane = lanesMapById[card.laneId];

            if (lane) {
                lane.cards = lane.cards?.concat(card);
            } else {
                unGroup.cards = unGroup.cards?.concat(card);
            }
        });
        lanes = unGroup.cards!.length > 0 ? [...lanes, unGroup] : [...lanes];
        return lanes.map((lane) => {
            if (!lane.cards) {
                lane.cards = [];
            }

            return {
                ...lane,
                entries: this.buildEntriesWithCards(lane.cards, entries)
            };
        });
    }

    expandAll(event: boolean) {
        this.isExpandAll = event;
    }
}
