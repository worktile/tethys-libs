import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef, input } from '@angular/core';
import { SafeAny } from 'ngx-tethys/types';
import { ThyFlexItem } from 'ngx-tethys/grid';
import { ThyBoardCard, ThyBoardEntry, ThyBoardLane } from '../entities';

@Component({
    selector: 'thy-board-entry',
    templateUrl: 'entry.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, NgTemplateOutlet, ScrollingModule, ExperimentalScrollingModule, ThyFlexItem],
    host: {
        class: 'thy-entry-container'
    }
})
export class ThyBoardEntryComponent implements OnInit {
    @Input({ required: true }) entry!: ThyBoardEntry;

    @Input() lane: ThyBoardLane | null = null;

    @Input() hasLane = false;

    @Input() cardTemplateRef: TemplateRef<SafeAny> | null = null;

    @Input() entryBodyFooter: TemplateRef<SafeAny> | null = null;

    constructor() {}

    ngOnInit() {}

    trackByFn(index: number, item: ThyBoardCard) {
        return item._id || index;
    }
}
