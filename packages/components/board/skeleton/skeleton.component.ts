import { ChangeDetectionStrategy, Component, ElementRef, input } from '@angular/core';
import { ThySkeletonRectangle } from 'ngx-tethys/skeleton';
import { ThyBoardEntry } from '../entities';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'thy-board-skeleton',
    templateUrl: './skeleton.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ThySkeletonRectangle, NgStyle],
    host: {
        class: 'thy-board-lane-container thy-board-skeleton'
    }
})
export class ThyBoardSkeletonComponent {
    hasLane = input<boolean>();

    entries = input.required<ThyBoardEntry[]>();

    constructor(public elementRef: ElementRef) {}
}
