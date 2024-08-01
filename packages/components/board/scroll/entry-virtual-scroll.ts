import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { AutoSizeVirtualScrollStrategy, CdkAutoSizeVirtualScroll, ItemSizeAverager } from '@angular/cdk-experimental/scrolling';
import { CdkVirtualScrollViewport, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import {
    contentChildren,
    Directive,
    effect,
    forwardRef,
    input,
    Input,
    numberAttribute,
    OnChanges,
    OnInit,
    signal,
    WritableSignal
} from '@angular/core';
import { ThyBoardCard } from '../entities';

export class EntryItemSizeAverager extends ItemSizeAverager {
    private averageItemSize: number;

    private defaultItemSize: number;

    constructor(defaultItemSize = 112) {
        super(defaultItemSize);
        this.defaultItemSize = defaultItemSize;
        this.averageItemSize = defaultItemSize;
    }

    setAverageItemSize(value: number) {
        return (this.averageItemSize = value);
    }

    getAverageItemSize(): number {
        return this.averageItemSize;
    }

    reset() {
        this.averageItemSize = this.defaultItemSize;
    }
}

export class ThyBoardEntryVirtualScrollStrategy extends AutoSizeVirtualScrollStrategy {
    private readonly _scrolledIndexChange = new Subject<number>();

    /** @docs-private Implemented as part of VirtualScrollStrategy. */
    scrolledIndexChange: Observable<number> = this._scrolledIndexChange.pipe(distinctUntilChanged());

    public entrySpacer: WritableSignal<number> = signal(0);

    private cardsHeightMap: Record<string, { index: number; height: number }> = {};

    constructor(minBufferPx: number, maxBufferPx: number, averager = new EntryItemSizeAverager()) {
        super(minBufferPx, maxBufferPx, averager);
    }

    /** @docs-private Implemented as part of VirtualScrollStrategy. */
    onDataLengthChanged() {
        if (this['_viewport']) {
            this.updateCardsHeight();
            this['_renderContentForCurrentOffset']();
            this.updateTotalContentSize();
        }
    }

    /** @docs-private Implemented as part of VirtualScrollStrategy. */
    onContentRendered() {
        if (this['_viewport']) {
            this.updateCardsHeight();
            this.updateTotalContentSize();
        }
    }

    onContentScrolled() {
        if (this['_viewport']) {
            super.onContentScrolled();
            const renderedRange = this['_viewport'].getRenderedRange();
            this._scrolledIndexChange.next(renderedRange.start);
        }
    }

    checkEntrySpacer() {
        const viewPort = this['_viewport'];
        if (viewPort) {
            viewPort.checkViewportSize();
            this.entrySpacer.set(this.getTotalContentSize());
        }
    }

    private getTotalContentSize(): number {
        if (!this['_viewport']) {
            return 0;
        }
        const viewport: CdkVirtualScrollViewport = this['_viewport'];

        let totalSize = 0;
        const keys = Object.keys(this.cardsHeightMap);
        keys.forEach((item) => {
            totalSize = totalSize + (this.cardsHeightMap[item].height || 112);
        });
        const averageSize = keys.length > 0 && totalSize > 0 ? totalSize / keys.length : 112;
        totalSize = totalSize + (viewport.getDataLength() - (keys.length || 0)) * averageSize;
        return totalSize;
    }

    private updateTotalContentSize() {
        const contentSize = this.getTotalContentSize();
        const viewport: CdkVirtualScrollViewport = this['_viewport'];
        this['_lastRenderedContentSize'] = viewport.measureRenderedContentSize();
        this['_averager'].setAverageItemSize(contentSize / viewport.getDataLength());
        viewport?.setTotalContentSize(contentSize);
        this.entrySpacer.set(contentSize);
    }

    public updateCards(cards: ThyBoardCard[]) {
        const cardsHeightMap: Record<string, { index: number; height: number }> = {};
        (cards || []).forEach((card, index) => {
            if (this.cardsHeightMap[card._id]) {
                cardsHeightMap[card._id] = { ...this.cardsHeightMap[card._id], index: index };
            } else {
                cardsHeightMap[card._id] = { height: 112, index: index };
            }
        });
        this.cardsHeightMap = { ...cardsHeightMap };
    }

    updateCardsHeight() {
        if (!this['_viewport']) {
            return;
        }
        const viewport: CdkVirtualScrollViewport = this['_viewport'];

        let isChanged = false;
        const childrenNodes: Element[] = Array.from(viewport.elementRef.nativeElement.firstElementChild?.children || []);
        childrenNodes.forEach((child: Element) => {
            const name = child?.getAttribute && child?.getAttribute('name');
            if (name) {
                const [cardId, cardIndex] = name.split('-');
                const temp = this.cardsHeightMap[cardId];
                if (temp?.height !== child.clientHeight) {
                    const height = child.clientHeight;
                    this.cardsHeightMap[cardId] = { index: Number(cardIndex), height: height };
                    isChanged = true;
                }
            }
        });
        if (isChanged) {
            this.updateTotalContentSize();
        }
    }

    detach() {
        super.detach();
        this._scrolledIndexChange.complete();
    }
}

export function entryVirtualScrollStrategyFactory(autoSizeDir: ThyBoardEntryVirtualScroll) {
    return autoSizeDir.scrollStrategy;
}

@Directive({
    selector: 'cdk-virtual-scroll-viewport[entry]',
    standalone: true,
    providers: [
        {
            provide: VIRTUAL_SCROLL_STRATEGY,
            useFactory: entryVirtualScrollStrategyFactory,
            deps: [forwardRef(() => ThyBoardEntryVirtualScroll)]
        }
    ]
})
export class ThyBoardEntryVirtualScroll extends CdkAutoSizeVirtualScroll implements OnInit, OnChanges {
    _minBufferPx = 800;

    @Input({ transform: numberAttribute, required: true }) set minBufferPx(value: number) {
        this._minBufferPx = value;
    }

    get minBufferPx() {
        return this._minBufferPx;
    }

    _maxBufferPx = 1500;

    @Input({ transform: numberAttribute, required: true }) set maxBufferPx(value: number) {
        this._maxBufferPx = value;
    }

    get maxBufferPx() {
        return this._maxBufferPx;
    }

    @Input({ transform: numberAttribute, required: true }) defaultCardSize = 112;

    cards = input.required<ThyBoardCard[]>();

    renderCardComponents = contentChildren('card', { descendants: true });

    public readonly scrollStrategy = new ThyBoardEntryVirtualScrollStrategy(
        this.minBufferPx,
        this.maxBufferPx,
        new EntryItemSizeAverager(112)
    );

    constructor() {
        super();

        effect(() => {
            this.scrollStrategy.updateCards(this.cards());
        });

        effect(
            () => {
                this.scrollStrategy.updateCardsHeight();
            },
            { allowSignalWrites: true }
        );
    }

    ngOnInit() {}

    ngOnChanges() {
        this._scrollStrategy.updateBufferSize(this.minBufferPx, this.maxBufferPx);
    }
}
