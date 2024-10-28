import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
    Directive,
    ChangeDetectorRef,
    ElementRef,
    NgZone,
    Renderer2,
    ViewChild,
    afterNextRender,
    effect,
    viewChild,
    viewChildren,
    inject
} from '@angular/core';
import { SafeAny } from 'ngx-tethys/types';
import { ThyBoardCard, ThyBoardDragContainer } from '../entities';
import { ThyBoardEntryVirtualScroll } from '../scroll/entry-virtual-scroll';
import { CdkDrag, CdkDragDrop, CdkDragStart, CdkDropList, DropListRef, transferArrayItem } from '@angular/cdk/drag-drop';
import { combineLatest, tap } from 'rxjs';
import { SharedResizeObserver } from '@angular/cdk/observers/private';
import { ThyBoardEntryAbstract } from '../entities';

@Directive()
export abstract class ThyBoardEntryBase {
    @ViewChild(ThyBoardEntryVirtualScroll) entryVirtualScroll!: ThyBoardEntryVirtualScroll;

    @ViewChild(CdkVirtualScrollViewport) currentViewport!: CdkVirtualScrollViewport;

    @ViewChild('entryBody') entryBody!: ElementRef;

    cdkDropLists = viewChildren(CdkDropList);

    bottom = viewChild<ElementRef>('bottom');

    top = viewChild<ElementRef>('top');

    public entryBodyHeight = 0;

    public entryDroppableZonesHeight = 0;

    public renderer = inject(Renderer2);

    public changeDetectorRef = inject(ChangeDetectorRef);

    public elementRef = inject(ElementRef);

    public sharedResizeObserver = inject(SharedResizeObserver);

    public ngZone = inject(NgZone);

    private preDraggingCard: CdkDrag<ThyBoardCard> | undefined;

    private preCdkDropLists: CdkDropList[] = [];

    constructor(public boardEntry: ThyBoardEntryAbstract) {
        effect(() => {
            this.setBodyHeight();
        });

        effect(() => {
            if (this.boardEntry.sortable() || this.boardEntry.movable()) {
                const draggingCard = this.boardEntry.draggingCard();
                const cdkDropLists = this.cdkDropLists();
                if (draggingCard && cdkDropLists?.length > 0 && this.preCdkDropLists.length < cdkDropLists.length) {
                    const siblings: CdkDropList<any>[] = [];
                    const group = draggingCard.dropContainer['_group'];
                    if (group) {
                        group._items.forEach((drop: any) => {
                            if (siblings.indexOf(drop) === -1) {
                                siblings.push(drop);
                            }
                        });
                    }

                    const refs = siblings
                        .filter((drop) => drop && drop !== draggingCard.dropContainer)
                        .map((list) => list._dropListRef)
                        .filter((ref) => {
                            const index = draggingCard.dropContainer._dropListRef['_siblings'].indexOf((sibling: DropListRef) => {
                                return sibling === ref;
                            });
                            return index < 0;
                        });
                    if (refs.length > 0) {
                        draggingCard.dropContainer._dropListRef.connectedTo([
                            ...draggingCard.dropContainer._dropListRef['_siblings'],
                            ...refs
                        ]);
                        (draggingCard.dropContainer._dropListRef['_notifyReceivingSiblings'] as any)();
                        this.preDraggingCard = draggingCard;
                        this.preCdkDropLists = [...cdkDropLists];
                    }
                }
                if (!draggingCard && this.preDraggingCard) {
                    this.preDraggingCard?.dropContainer._dropListRef['_reset']();
                    this.preDraggingCard = draggingCard;
                    this.preCdkDropLists = [];
                }
            }
        });

        afterNextRender(() => {
            if (this.boardEntry.hasLane() && (this.bottom() || this.top())) {
                // 修正虚拟滚动区域高度
                this.ngZone.runOutsideAngular(() => {
                    combineLatest([
                        this.sharedResizeObserver.observe(this.bottom()?.nativeElement, { box: 'border-box' }),
                        this.sharedResizeObserver.observe(this.top()?.nativeElement, { box: 'border-box' })
                    ]).subscribe(() => {
                        this.setBodyHeight();
                    });
                });
            }
        });
    }

    setBodyHeight() {
        const virtualScroll = this.boardEntry.virtualScroll();
        const containerHeight = this.boardEntry.container()?.clientHeight;
        const laneHeight = this.boardEntry.laneHeight();

        if (this.boardEntry.hasLane()) {
            if (virtualScroll) {
                const realHeight = this._getRealHeight();
                if (this.entryVirtualScroll) {
                    this.entryBodyHeight = Math.min(containerHeight, realHeight);
                } else {
                    this.entryBodyHeight = containerHeight;
                }
                this.entryDroppableZonesHeight = Math.min(laneHeight, containerHeight);
            } else {
                this.entryBodyHeight = containerHeight;
                this.entryDroppableZonesHeight = Math.min(this.elementRef.nativeElement.parentElement.clientHeight, containerHeight);
            }
            this.changeDetectorRef.markForCheck();
        }
    }

    _getRealHeight() {
        return (
            this.entryVirtualScroll?.scrollStrategy?.entrySpacer() +
            (this.bottom()?.nativeElement?.clientHeight || 0) +
            (this.top()?.nativeElement?.clientHeight || 0)
        );
    }

    scrolledIndexChange(event: number) {
        this.boardEntry.virtualScrolledIndexChange.emit({
            renderedRange: this.currentViewport.getRenderedRange(),
            entry: this.boardEntry.entry(),
            lane: this.boardEntry.lane()!
        });
    }

    cdkDragStarted(event: CdkDragStart) {
        this.boardEntry.cardDragStarted.emit(event.source);
    }

    dragReleased(): void {}

    checkCardDroppable(drag: CdkDrag<ThyBoardCard>, container: ThyBoardDragContainer): boolean {
        return false;
    }

    private checkCardDropInLaneAndEntry(card: CdkDrag<ThyBoardCard>, container: ThyBoardDragContainer): boolean {
        if (this.boardEntry.sortable() || this.boardEntry.movable()) {
            return this.checkCardDroppable(card, container);
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
            const cardDropEnterPredicate = this.boardEntry.cardDropEnterPredicate();
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
        const cardDropAction = this.boardEntry.cardDropAction();
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
        const realHeight = this._getRealHeight();

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
