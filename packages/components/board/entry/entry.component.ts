import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { NgStyle, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnInit,
    TemplateRef,
    ViewChild,
    booleanAttribute,
    effect,
    input,
    numberAttribute
} from '@angular/core';
import { SafeAny } from 'ngx-tethys/types';
import { ThyFlexItem } from 'ngx-tethys/grid';
import { ThyBoardCard, ThyBoardEntry, ThyBoardLane } from '../entities';
import { ThyBoardEntryVirtualScroll } from '../scroll/entry-virtual-scroll';
import { CdkDragDrop, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
    selector: 'thy-board-entry',
    templateUrl: 'entry.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgStyle,
        NgTemplateOutlet,
        ScrollingModule,
        DragDropModule,
        ExperimentalScrollingModule,
        ThyFlexItem,
        ThyBoardEntryVirtualScroll
    ],
    host: {
        class: 'thy-entry-container'
    }
})
export class ThyBoardEntryComponent implements OnInit {
    @ViewChild(ThyBoardEntryVirtualScroll) entryVirtualScroll!: ThyBoardEntryVirtualScroll;

    @ViewChild(CdkVirtualScrollViewport) currentViewport!: CdkVirtualScrollViewport;

    @ViewChild('entryBody') entryBody!: ElementRef;

    @Input({ required: true }) entry!: ThyBoardEntry;

    @Input() lane: ThyBoardLane | undefined;

    @Input() hasLane = false;

    @Input({ transform: booleanAttribute }) virtualScroll = false;

    @Input() cardTemplateRef: TemplateRef<SafeAny> | null = null;

    @Input() entryBodyFooter: TemplateRef<SafeAny> | null = null;

    container = input.required<HTMLElement>();

    @Input({ transform: numberAttribute }) defaultCardSize = 112;

    public entryBodyHeight = 0;

    constructor() {
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

    cdkDragStarted(event: CdkDragStart) {}

    cdkDropListEnterPredicate = () => {
        return false;
    };

    drop(event: CdkDragDrop<ThyBoardCard>) {}

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
