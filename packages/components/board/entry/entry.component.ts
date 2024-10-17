import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    NgZone,
    OnInit,
    Renderer2,
    TemplateRef,
    ViewChild,
    afterNextRender,
    booleanAttribute,
    computed,
    effect,
    input,
    numberAttribute,
    output,
    viewChild
} from '@angular/core';
import { SafeAny } from 'ngx-tethys/types';
import { ThyFlexItem } from 'ngx-tethys/grid';
import {
    ThyBoardCard,
    ThyBoardDragContainer,
    ThyBoardDragScopeType,
    ThyBoardDropActionEvent,
    ThyBoardDragPredicateEvent,
    ThyBoardEntry,
    ThyBoardLane,
    ThyBoardZone,
    ThyBoardVirtualScrolledIndexChangeEvent
} from '../entities';
import { ThyBoardEntryVirtualScroll } from '../scroll/entry-virtual-scroll';
import { CdkDrag, CdkDragDrop, CdkDragStart, CdkDropList, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { ThyDragDropDirective } from 'ngx-tethys/shared';
import { combineLatest, Observable, tap } from 'rxjs';
import { ThyBoardFuncPipe } from '../board.pipe';
import { SharedResizeObserver } from '@angular/cdk/observers/private';

@Component({
    selector: 'thy-board-entry',
    templateUrl: 'entry.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgStyle,
        NgTemplateOutlet,
        NgClass,
        ScrollingModule,
        DragDropModule,
        ExperimentalScrollingModule,
        ThyFlexItem,
        ThyBoardEntryVirtualScroll,
        ThyDragDropDirective,
        ThyBoardFuncPipe
    ],
    host: {
        class: 'thy-entry-container board-lane-body-entry',
        '[class.thy-entry-collapsed]': '!entry()?.expanded'
    }
})
export class ThyBoardEntryComponent implements OnInit {
    @ViewChild(ThyBoardEntryVirtualScroll) entryVirtualScroll!: ThyBoardEntryVirtualScroll;

    @ViewChild(CdkVirtualScrollViewport) currentViewport!: CdkVirtualScrollViewport;

    @ViewChild('entryBody') entryBody!: ElementRef;

    entry = input.required<ThyBoardEntry>();

    hasLane = input(false, { transform: booleanAttribute });

    lane = input<ThyBoardLane>();

    laneHeight = input(0, { transform: numberAttribute });

    virtualScroll = input(false, { transform: booleanAttribute });

    cardTemplateRef = input<TemplateRef<SafeAny>>();

    container = input.required<HTMLElement>();

    defaultCardSize = input(112, { transform: numberAttribute });

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

    topTemplateRef = input<TemplateRef<SafeAny>>();

    bottomTemplateRef = input<TemplateRef<SafeAny>>();

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

    cardDraggablePredicate = input<(event: ThyBoardDragPredicateEvent) => boolean>();

    cardDropEnterPredicate = input<(event: ThyBoardDragPredicateEvent) => boolean>();

    cardDropAction = input<(event: ThyBoardDropActionEvent) => Observable<boolean>>();

    cardDragStarted = output<CdkDrag<ThyBoardCard>>();

    virtualScrolledIndexChange = output<ThyBoardVirtualScrolledIndexChangeEvent>();

    bottom = viewChild<ElementRef>('bottom');

    top = viewChild<ElementRef>('top');

    public entryBodyHeight = 0;

    public entryDroppableZonesHeight = 0;

    public isDraggingList = false;

    public showBackDropWhenDragging = computed(() => {
        const movable = this.movable();
        const sortable = this.sortable();
        const draggingCard = this.draggingCard();
        if (draggingCard) {
            if (movable) {
                return this.checkCardDrapableOnMovable(draggingCard, { entry: this.entry(), lane: this.lane() });
            }
            if (sortable) {
                return false;
            }
        } else {
            this.isDraggingList = false;
        }
        return false;
    });

    cardDroppableZone = computed(() => {
        const cardDroppableZones = this.cardDroppableZones();
        const hasDroppableZones = this.hasDroppableZones();
        if (hasDroppableZones) {
            const entry = this.entry();
            const draggingCard = this.draggingCard();
            if (draggingCard && cardDroppableZones) {
                return this.hasLane()
                    ? (cardDroppableZones &&
                          cardDroppableZones?.find((zone) => zone.entryId === this.entry()._id && zone.laneId === this.lane()?._id)
                              ?.droppableZones) ||
                          null
                    : (cardDroppableZones && cardDroppableZones?.find((zone) => zone.entryId === this.entry()._id)?.droppableZones) || null;
            } else {
                return entry.droppableZones || [];
            }
        }
        return [];
    });

    dropReady = computed(() => {
        const cardDroppableZones = this.cardDroppableZones();
        const draggingCard = this.draggingCard();
        const hasDroppableZones = this.hasDroppableZones();
        if (hasDroppableZones) {
            if (draggingCard && cardDroppableZones) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    });

    constructor(
        private renderer: Renderer2,
        public changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef,
        private sharedResizeObserver: SharedResizeObserver,
        private ngZone: NgZone
    ) {
        effect(() => {
            this.setBodyHeight();
        });

        afterNextRender(() => {
            if (this.hasLane() && (this.bottom() || this.top())) {
                // 修正虚拟滚动区域高度
                this.ngZone.runOutsideAngular(() => {
                    combineLatest([
                        this.sharedResizeObserver.observe(this.bottom()!.nativeElement, { box: 'border-box' }),
                        this.sharedResizeObserver.observe(this.top()!.nativeElement, { box: 'border-box' })
                    ]).subscribe(() => {
                        this.setBodyHeight();
                    });
                });
            }
        });
    }

    ngOnInit() {}

    setBodyHeight() {
        const virtualScroll = this.virtualScroll();
        const containerHeight = this.container()?.clientHeight;
        const laneHeight = this.laneHeight();
        const bottom = this.bottom();
        const top = this.top();

        if (this.hasLane()) {
            if (virtualScroll) {
                const realHeight = this.getRealHeight();
                if (this.entryVirtualScroll) {
                    this.entryBodyHeight = Math.min(containerHeight, realHeight);
                } else {
                    this.entryBodyHeight = containerHeight;
                }
                this.entryDroppableZonesHeight = Math.min(this.laneHeight(), containerHeight);
            } else {
                this.entryBodyHeight = containerHeight;
                this.entryDroppableZonesHeight = Math.min(this.elementRef.nativeElement.parentElement.clientHeight, containerHeight);
            }
            this.changeDetectorRef.markForCheck();
        }
    }

    private getRealHeight() {
        return (
            this.entryVirtualScroll?.scrollStrategy?.entrySpacer() +
            (this.bottom()?.nativeElement?.clientHeight || 0) +
            (this.top()?.nativeElement?.clientHeight || 0)
        );
    }

    scrolledIndexChange(event: number) {
        this.virtualScrolledIndexChange.emit({
            renderedRange: this.currentViewport.getRenderedRange(),
            entry: this.entry(),
            lane: this.lane()!
        });
    }

    cdkDragStarted(event: CdkDragStart) {
        this.isDraggingList = true;
        const cardHeight = event.source.dropContainer.element.nativeElement.clientHeight;
        this.renderer.setStyle(event.source.dropContainer.element.nativeElement, 'height', cardHeight + 'px');
        this.cardDragStarted.emit(event.source);
    }

    checkCardDrapableOnMovable(drag: CdkDrag<ThyBoardCard>, container: ThyBoardDragContainer) {
        const originContainer = drag.dropContainer.data;
        if (this.movable()) {
            if (this.movable() === ThyBoardDragScopeType.entries) {
                // 支持变更栏 entry：泳道相同，且 不在原来的栏
                return this.hasLane()
                    ? originContainer.lane._id === container.lane?._id && originContainer.entry._id !== container.entry?._id
                    : originContainer.entry._id !== container.entry?._id;
            }
            if (this.movable() === ThyBoardDragScopeType.lanes) {
                // 支持变更泳道 lane: 栏相同 且 不在原来的泳道
                return this.hasLane()
                    ? originContainer.entry._id === container.entry?._id && originContainer.lane._id !== container.lane?._id
                    : false;
            }
            if (this.movable() === ThyBoardDragScopeType.all) {
                // 支持变更栏和泳道: 不在原来的栏或者不在原来的泳道
                return this.hasLane()
                    ? originContainer.entry._id !== container.entry?._id || originContainer.lane._id !== container.lane?._id
                    : originContainer.entry._id !== container.entry?._id;
            }
        }
        return false;
    }

    checkCardDrapableOnSortable(drag: CdkDrag<ThyBoardCard>, container: ThyBoardDragContainer) {
        const originContainer = drag.dropContainer.data;
        if (this.sortable()) {
            if (this.sortable() === ThyBoardDragScopeType.entries) {
                // 支持拖动变更栏，并且排序: 泳道相同
                return this.hasLane() ? originContainer.lane._id === container.lane?._id : true;
            }
            if (this.sortable() === ThyBoardDragScopeType.lanes) {
                // 支持拖动变更泳道，并且排序: 栏相同
                return originContainer.entry._id === container.entry?._id;
            }
            if (this.sortable() === ThyBoardDragScopeType.all) {
                // 支持拖动变更栏和泳道，并且排序: 任意栏
                return true;
            }
        }
        return false;
    }

    private checkCardDropInLaneAndEntry(card: CdkDrag<ThyBoardCard>, container: ThyBoardDragContainer): boolean {
        if (this.movable()) {
            return this.checkCardDrapableOnMovable(card, container);
        }
        if (this.sortable()) {
            return this.checkCardDrapableOnSortable(card, container);
        }
        return false;
    }

    dropListEnterPredicate = (drag: CdkDrag<ThyBoardCard>, drop: CdkDropList<ThyBoardDragContainer>) => {
        const container: ThyBoardDragContainer = {
            entry: drop.data.entry,
            lane: drop.data.lane,
            cards: drop.data.cards,
            zone: drop.data.zone
        };
        if (!this.checkCardDropInLaneAndEntry(drag, container)) {
            return false;
        } else {
            const cardDropEnterPredicate = this.cardDropEnterPredicate();
            if (cardDropEnterPredicate) {
                return cardDropEnterPredicate({
                    card: drag.data,
                    container: container
                });
            } else {
                return false;
            }
        }
    };

    drop(event: CdkDragDrop<ThyBoardDragContainer | SafeAny>) {
        const previousIndex = (event.previousContainer.data?.cards || []).findIndex(
            (card: ThyBoardCard) => card._id === event.item.data._id
        );
        const currentIndex = (event.container.data?.cards || []).findIndex((card: ThyBoardCard) => card._id === event.item.data._id);
        transferArrayItem(event.previousContainer.data?.cards!, event.container.data?.cards!, previousIndex, currentIndex);
        const cardDropAction = this.cardDropAction();
        if (cardDropAction) {
            cardDropAction({
                card: event.item.data,
                previousContainer: event.previousContainer.data!,
                previousIndex: event.previousIndex,
                container: event.container.data!,
                currentIndex: event.currentIndex
            })
                .pipe(
                    tap((result: boolean) => {
                        if (!result) {
                            transferArrayItem(
                                event.container.data?.cards!,
                                event.previousContainer.data?.cards!,
                                currentIndex,
                                previousIndex
                            );
                            event.previousContainer.data.changeDetectorRef.markForCheck();
                            this.changeDetectorRef.markForCheck();
                        }
                    })
                )
                .subscribe();
        }
    }

    scrollToOffset(payload: { position: 'top' | 'middle' | 'bottom'; scrollTop: number; laneHight: number }) {
        const realHeight = this.getRealHeight();

        if (payload.position) {
            if (payload.position === 'bottom') {
                this.currentViewport.scrollTo({ bottom: 0 });
                if (
                    this.entryVirtualScroll.scrollStrategy.entrySpacer() > 0 &&
                    payload.laneHight - payload.scrollTop > this.entryBodyHeight
                ) {
                    const offset = -(payload.scrollTop + this.entryBodyHeight - realHeight);
                    const renderedContentTransform = `translateY(${Number(offset)}px)`;
                    this.entryBody.nativeElement.style.transform = renderedContentTransform;
                }
            } else {
                if (
                    payload.scrollTop > 0 &&
                    payload.scrollTop > this.entryVirtualScroll.scrollStrategy.entrySpacer() - this.entryBodyHeight
                ) {
                    this.currentViewport.scrollTo({ bottom: 0 });

                    if (
                        payload.scrollTop > 0 &&
                        payload.scrollTop < this.entryVirtualScroll.scrollStrategy.entrySpacer() &&
                        payload.laneHight - payload.scrollTop > this.entryBodyHeight
                    ) {
                        const offset = -(payload.scrollTop + this.entryBodyHeight - realHeight);
                        const renderedContentTransform = `translateY(${Number(offset)}px)`;
                        this.entryBody.nativeElement.style.transform = renderedContentTransform;
                    } else if (payload.scrollTop === 0) {
                        this.entryBody.nativeElement.style.transform = '';
                    }
                } else {
                    if (!!this.entryBody.nativeElement.style.transform) {
                        this.entryBody.nativeElement.style.transform = '';
                    }

                    this.currentViewport.scrollToOffset(Math.max(0, payload.scrollTop));
                }
            }
        }
    }

    trackByFn(index: number, item: ThyBoardCard) {
        return item._id || index;
    }
}
