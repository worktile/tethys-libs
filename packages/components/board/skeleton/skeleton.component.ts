import { ChangeDetectionStrategy, Component, ElementRef, input } from '@angular/core';
import { ThySkeletonRectangle } from 'ngx-tethys/skeleton';
import { ThyBoardEntry } from '../entities';

@Component({
    selector: 'thy-board-skeleton',
    templateUrl: './skeleton.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ThySkeletonRectangle],
    host: {
        class: 'thy-board-lane-container thy-board-skeleton'
    }
})
export class ThyBoardSkeletonComponent {
    hasLane = input<boolean>();

    entries = input.required<ThyBoardEntry[]>();

    constructor(public elementRef: ElementRef) {}
}
