import {
    Directive,
    ElementRef,
    NgZone,
    Renderer2,
    afterNextRender,
    effect,
    viewChild,
    inject,
    WritableSignal,
    signal,
    input,
    computed,
    untracked
} from '@angular/core';
import { ThyBoardCard, ThyBoardEntryStatus } from '../entities';
import { ThyBoardEntryVirtualScroll } from '../scroll/entry-virtual-scroll';
import { combineLatest, debounceTime, Observable } from 'rxjs';
import { SharedResizeObserver } from '@angular/cdk/observers/private';
import { ThyBoardEntryAbstract } from '../entities';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThyBoardEntryDragDrop } from './entry-drag-drop';
import { helpers } from 'ngx-tethys/util';

@Directive()
export abstract class ThyBoardEntryBase extends ThyBoardEntryDragDrop {
    public renderer = inject(Renderer2);

    public elementRef = inject(ElementRef);

    public sharedResizeObserver = inject(SharedResizeObserver);

    public ngZone = inject(NgZone);

    entryVirtualScroll = viewChild(ThyBoardEntryVirtualScroll);

    entryBody = viewChild<ElementRef>('entryBody');

    bottom = viewChild<ElementRef>('bottom');

    top = viewChild<ElementRef>('top');

    entrySplitTitle = viewChild<ElementRef>('entrySplitTitle');

    status = input<ThyBoardEntryStatus>();

    public cards = computed(() => {
        if (this.boardEntry.entry().split && this.boardEntry.entry().cards && this.status()) {
            return untracked(() => {
                return (this.boardEntry.entry().cards || []).filter((card) => {
                    const cardStatus = this.getCardStatus(card);
                    return cardStatus === this.status();
                });
            });
        } else {
            return this.boardEntry.entry().cards;
        }
    });

    public entryBodyHeight = 0;

    public entryDroppableZonesHeight = 0;

    public entryRealHeight: WritableSignal<number> = signal(0);

    public boardEntryStatus = ThyBoardEntryStatus;

    private takeUntilDestroyed = takeUntilDestroyed();

    constructor(public boardEntry: ThyBoardEntryAbstract) {
        super(boardEntry);
        effect(
            () => {
                this.setBodyHeight();
            },
            { allowSignalWrites: true }
        );

        afterNextRender(() => {
            if (this.boardEntry.virtualScroll() && this.boardEntry.hasLane()) {
                const elementsObserve: Observable<ResizeObserverEntry[]>[] = [
                    this.sharedResizeObserver.observe(this.boardEntry.container(), { box: 'border-box' }).pipe(debounceTime(100))
                ];
                if (this.top()) {
                    elementsObserve.push(this.sharedResizeObserver.observe(this.top()?.nativeElement, { box: 'border-box' }));
                }
                if (this.bottom()) {
                    elementsObserve.push(this.sharedResizeObserver.observe(this.bottom()?.nativeElement, { box: 'border-box' }));
                }
                if (elementsObserve.length > 0) {
                    // 修正虚拟滚动区域高度
                    this.ngZone.runOutsideAngular(() => {
                        combineLatest(elementsObserve)
                            .pipe(this.takeUntilDestroyed)
                            .subscribe(() => {
                                this.setBodyHeight();
                            });
                    });
                }
            }
        });
    }

    setBodyHeight() {
        const virtualScroll = this.boardEntry.virtualScroll();
        const containerHeight = this.boardEntry.container()?.clientHeight;
        const laneHeight = this.boardEntry.laneHeight();
        const draggingCard = this.boardEntry.draggingCard();

        if (virtualScroll) {
            if (draggingCard) {
                this.entryBodyHeight = Math.min(laneHeight, containerHeight);
            } else {
                const realHeight = this._getRealHeight();
                this.entryRealHeight.set(realHeight);
                if (this.entryVirtualScroll()) {
                    this.entryBodyHeight = Math.min(containerHeight, realHeight);
                } else {
                    this.entryBodyHeight = containerHeight;
                }
                this.entryDroppableZonesHeight = Math.min(laneHeight, containerHeight);
            }
        } else {
            this.entryBodyHeight = containerHeight;
            this.entryDroppableZonesHeight = Math.min(this.elementRef.nativeElement.parentElement.clientHeight, containerHeight);
        }
        this.changeDetectorRef.markForCheck();
    }

    private getCardStatus(card: ThyBoardCard): ThyBoardEntryStatus {
        if (helpers.isArray(card.status)) {
            const status = card.status.find((status) => {
                if (this.boardEntry.hasLane()) {
                    return status.entryId === this.boardEntry.entry()._id && status.laneId === this.boardEntry.lane()._id;
                } else {
                    return status.entryId === this.boardEntry.entry()._id;
                }
            });
            return status?.state!;
        } else {
            return card.status as ThyBoardEntryStatus;
        }
    }

    _getRealHeight() {
        return (
            this.entryVirtualScroll()?.scrollStrategy?.entrySpacer() +
            (this.bottom()?.nativeElement?.clientHeight || 0) +
            (this.top()?.nativeElement?.clientHeight || 0) +
            (this.entrySplitTitle()?.nativeElement?.clientHeight || 0)
        );
    }

    scrolledIndexChange(event: number) {
        this.boardEntry.virtualScrolledIndexChange.emit({
            renderedRange: this.currentViewport()!.getRenderedRange(),
            entry: this.boardEntry.entry(),
            lane: this.boardEntry.lane()!,
            status: this.status()
        });
    }

    scrollToOffset(payload: { position: 'top' | 'middle' | 'bottom'; scrollTop: number; laneHight: number }) {
        const realHeight = this._getRealHeight();

        if (payload.position) {
            if (payload.position === 'bottom') {
                this.currentViewport()?.scrollTo({ bottom: 0 });
                if (realHeight > 0 && payload.laneHight - payload.scrollTop > this.entryBodyHeight) {
                    const offset = -(payload.scrollTop + this.entryBodyHeight - realHeight);
                    const renderedContentTransform = `translateY(${Number(offset)}px)`;
                    this.entryBody()!.nativeElement.style.transform = renderedContentTransform;
                }
            } else {
                if (payload.scrollTop > 0 && payload.scrollTop > realHeight - this.entryBodyHeight) {
                    this.currentViewport()!.scrollTo({ bottom: 0 });

                    if (
                        payload.scrollTop > 0 &&
                        payload.scrollTop < realHeight &&
                        payload.laneHight - payload.scrollTop > this.entryBodyHeight
                    ) {
                        const offset = -(payload.scrollTop + this.entryBodyHeight - realHeight);
                        const renderedContentTransform = `translateY(${Number(offset)}px)`;
                        this.entryBody()!.nativeElement.style.transform = renderedContentTransform;
                    } else if (payload.scrollTop === 0) {
                        this.entryBody()!.nativeElement.style.transform = '';
                    }
                } else {
                    if (!!this.entryBody()!.nativeElement.style.transform) {
                        this.entryBody()!.nativeElement.style.transform = '';
                    }

                    if (this.entryVirtualScroll()?.scrollStrategy?.entrySpacer()! > 0) {
                        this.currentViewport()!.scrollToOffset(Math.max(0, payload.scrollTop));
                    }
                }
            }
        }
    }

    trackByFn(index: number, item: ThyBoardCard) {
        return item._id || index;
    }
}
