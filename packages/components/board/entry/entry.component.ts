import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    Renderer2,
    TemplateRef,
    ViewChild,
    booleanAttribute,
    computed,
    effect,
    input,
    numberAttribute,
    output
} from '@angular/core';
import { SafeAny } from 'ngx-tethys/types';
import { ThyFlexItem } from 'ngx-tethys/grid';
import {
    ThyBoardCard,
    ThyBoardDragContainer,
    ThyBoardDragScopeType,
    ThyBoardDragScopeTypes,
    ThyBoardDragStartEvent,
    ThyBoardDropActionEvent,
    ThyBoardDropEnterPredicateEvent,
    ThyBoardEntry,
    ThyBoardLane
} from '../entities';
import { ThyBoardEntryVirtualScroll } from '../scroll/entry-virtual-scroll';
import { CdkDrag, CdkDragDrop, CdkDragStart, CdkDropList, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { ThyDragDropDirective } from 'ngx-tethys/shared';
import { Observable, tap } from 'rxjs';

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
        ThyDragDropDirective
    ],
    host: {
        class: 'thy-entry-container board-lane-body-entry',
        '[class.thy-entry-collapsed]': '!entry?.expanded'
    }
})
export class ThyBoardEntryComponent implements OnInit {
    @ViewChild(ThyBoardEntryVirtualScroll) entryVirtualScroll!: ThyBoardEntryVirtualScroll;

    @ViewChild(CdkVirtualScrollViewport) currentViewport!: CdkVirtualScrollViewport;

    @ViewChild('entryBody') entryBody!: ElementRef;

    @Input({ required: true }) entry!: ThyBoardEntry;

    @Input() hasLane = false;

    @Input() lane: ThyBoardLane | undefined;

    @Input({ transform: booleanAttribute }) virtualScroll = false;

    @Input() cardTemplateRef: TemplateRef<SafeAny> | null = null;

    @Input() entryBodyFooter: TemplateRef<SafeAny> | null = null;

    container = input.required<HTMLElement>();

    draggingCard = input<ThyBoardCard>();

    @Input({ transform: numberAttribute }) defaultCardSize = 112;

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

    @Input() dropEnterPredicate: ((event: ThyBoardDropEnterPredicateEvent) => boolean) | undefined;

    @Input() dropAction: ((event: ThyBoardDropActionEvent) => Observable<boolean>) | undefined;

    dragStarted = output<ThyBoardDragStartEvent>();

    public entryBodyHeight = 0;

    public isDraggingList = false;

    public showBackDropWhenDragging = computed(() => {
        const movable = this.movable();
        const sortable = this.sortable();
        const draggingCard = this.draggingCard();
        if (draggingCard) {
            if (movable) {
                return this.checkCardDrapableOnMovable(draggingCard, { entry: this.entry, lane: this.lane });
            }
            if (sortable) {
                return false;
            }
        } else {
            this.isDraggingList = false;
        }
        return false;
    });

    constructor(
        private renderer: Renderer2,
        public changeDetectorRef: ChangeDetectorRef
    ) {
        effect(() => {
            this.setBodyHeight();
        });
    }

    ngOnInit() {}

    setBodyHeight() {
        if (this.hasLane && this.virtualScroll) {
            const entrySpacer = this.entryVirtualScroll?.scrollStrategy?.entrySpacer();
            const containerHeight = this.container()?.clientHeight;
            if (this.entryVirtualScroll) {
                this.entryBodyHeight = Math.min(containerHeight, entrySpacer);
            } else {
                this.entryBodyHeight = containerHeight;
            }
        }
    }

    scrolledIndexChange(event: number) {}

    cdkDragStarted(event: CdkDragStart) {
        this.isDraggingList = true;
        const cardHeight = event.source.dropContainer.element.nativeElement.clientHeight;
        this.renderer.setStyle(event.source.dropContainer.element.nativeElement, 'height', cardHeight + 'px');
        this.dragStarted.emit({ card: event.source.data });
    }

    checkCardDrapableOnMovable(card: ThyBoardCard, container: ThyBoardDragContainer) {
        if (this.movable()) {
            if (this.movable() === ThyBoardDragScopeTypes.entries) {
                // 支持变更栏 entry：泳道相同，且 不在原来的栏
                return this.hasLane
                    ? card.laneId === container.lane?._id && card.entryId !== container.entry?._id
                    : card.entryId !== container.entry?._id;
            }
            if (this.movable() === ThyBoardDragScopeTypes.lanes) {
                // 支持变更泳道 lane: 栏相同 且 不在原来的泳道
                return this.hasLane
                    ? card.entryId === container.entry?._id && !(container.lane?.cards || []).find((item) => item._id === card._id)
                    : false;
            }
            if (this.movable() === ThyBoardDragScopeTypes.all) {
                // 支持变更栏和泳道
                return (
                    !(container.lane?.cards || []).find((item) => item._id === card._id) ||
                    !(container.entry?.cards || []).find((item) => item._id === card._id)
                );
            }
        }
        return false;
    }

    checkCardDrapableOnSortable(card: ThyBoardCard, container: ThyBoardDragContainer) {
        if (this.sortable()) {
            if (this.sortable() === ThyBoardDragScopeTypes.entries) {
                // 支持拖动变更栏，并且排序
                return this.hasLane ? card.laneId === container.lane?._id : true;
            }
            if (this.sortable() === ThyBoardDragScopeTypes.lanes) {
                // 支持拖动变更泳道，并且排序
                return card.entryId === container.entry?._id;
            }
            if (this.sortable() === ThyBoardDragScopeTypes.all) {
                // 支持拖动变更栏和泳道，并且排序
                return true;
            }
        }
        return false;
    }

    private checkCardDropInLaneAndEntry(card: ThyBoardCard, container: ThyBoardDragContainer): boolean {
        if (this.movable()) {
            return this.checkCardDrapableOnMovable(card, container);
        }
        if (this.sortable()) {
            return this.checkCardDrapableOnSortable(card, container);
        }
        return false;
    }

    dropListEnterPredicate = (drag: CdkDrag<ThyBoardCard>, drop: CdkDropList<ThyBoardDragContainer>) => {
        const container: ThyBoardDragContainer = { entry: drop.data.entry, lane: drop.data.lane, cards: drop.data.cards };
        if (!this.checkCardDropInLaneAndEntry(drag.data, container)) {
            return false;
        } else {
            if (this.dropEnterPredicate) {
                return this.dropEnterPredicate({
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
        if (this.dropAction) {
            this.dropAction({
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
        const realHeight = this.entryVirtualScroll.scrollStrategy.entrySpacer();

        if (payload.position) {
            if (payload.position === 'bottom') {
                this.currentViewport.scrollTo({ bottom: 0 });
            } else {
                if (payload.scrollTop > this.entryVirtualScroll.scrollStrategy.entrySpacer() - this.entryBodyHeight) {
                    this.currentViewport.scrollTo({ bottom: 0 });

                    if (payload.laneHight - payload.scrollTop > this.entryBodyHeight) {
                        const offset = -(payload.scrollTop + this.entryBodyHeight - realHeight);
                        const renderedContentTransform = `translateY(${Number(offset)}px)`;
                        this.entryBody.nativeElement.style.transform = renderedContentTransform;
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
