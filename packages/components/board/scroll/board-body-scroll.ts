import { CdkScrollable } from '@angular/cdk/scrolling';
import { AfterViewInit, booleanAttribute, ContentChildren, Directive, Input, input, QueryList } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { animationFrameScheduler, asapScheduler, auditTime } from 'rxjs';
import { ThyBoardLane } from '../entities';
import { ThyBoardLaneComponent } from '../lane/lane.component';

const SCROLL_SCHEDULER = typeof requestAnimationFrame !== 'undefined' ? animationFrameScheduler : asapScheduler;

@Directive({
    selector: '[thy-board-body-scrollable], [thyBoardBodyScrollable]',
    standalone: true
})
export class ThyBoardBodyScrollableDirective extends CdkScrollable implements AfterViewInit {
    @ContentChildren(ThyBoardLaneComponent) lanes!: QueryList<ThyBoardLaneComponent>;

    /**
     * 是否禁用自定义滚动
     * @default false
     * @type boolean
     */
    @Input({ transform: booleanAttribute }) thyBoardBodyScrollable: boolean = false;

    private takeUntilDestroyed = takeUntilDestroyed();

    ngAfterViewInit(): void {
        if (!this.thyBoardBodyScrollable) {
            this.ngZone.runOutsideAngular(() => {
                this.elementScrolled()
                    .pipe(auditTime(0, SCROLL_SCHEDULER), this.takeUntilDestroyed)
                    .subscribe(() => {
                        this.laneScrollToOffset();
                    });
            });
        }
    }

    private laneIsInViewport(
        preLanesTotalSize: number,
        laneSpacerSize: number
    ): { position: 'top' | 'middle' | 'bottom'; scrollTop: number; laneHight: number } | null {
        const scrollOffset = this.measureScrollOffset('top');
        const offsetHeight = this.elementRef.nativeElement.offsetHeight;

        // 头
        if (preLanesTotalSize <= scrollOffset + offsetHeight && preLanesTotalSize >= scrollOffset) {
            const scrollTop = 0;
            return {
                position: 'top',
                scrollTop: scrollTop,
                laneHight: laneSpacerSize
            };
        } else if (preLanesTotalSize < scrollOffset && preLanesTotalSize + laneSpacerSize > scrollOffset + offsetHeight) {
            const scrollTop = scrollOffset - preLanesTotalSize;

            return {
                position: 'middle',
                scrollTop: scrollTop,
                laneHight: laneSpacerSize
            };
        } else if (preLanesTotalSize + laneSpacerSize > scrollOffset && preLanesTotalSize + laneSpacerSize < scrollOffset + offsetHeight) {
            // 尾
            const scrollTop = scrollOffset - preLanesTotalSize;

            return {
                position: 'bottom',
                scrollTop: scrollTop,
                laneHight: laneSpacerSize
            };
        }

        return null;
    }

    private laneScrollToOffset() {
        let preLanesTotalSize = 0;
        this.lanes.forEach((lane, index) => {
            const laneSpacerSize = lane.lane()?.expanded ? lane.laneHeight : 65;

            /**
             *  触发 lane 滚动: 滚动当前视窗范围内的 lane
             * 1. laneSpacerSize 大于 看板内容高度
             * 2. preLanesTotalSize 大于 看板整体滚动  scrollOffset < preLanesTotalSize &&
             * 3. 看板整体滚动距离 + 当前视窗 小于 preLanesTotalSize  scrollOffset + this.viewport.elementRef.nativeElement.offsetHeight < preLanesTotalSize
             *  滚动距离：看板整体滚动距离 - preLanesTotalSize - 当前视窗
             */

            const position = this.laneIsInViewport(preLanesTotalSize, laneSpacerSize);
            if (position) {
                (lane.entryComponents || []).forEach((entry) => {
                    entry.scrollToOffset(position);
                });
            }

            preLanesTotalSize = preLanesTotalSize + laneSpacerSize;
        });
    }
}
