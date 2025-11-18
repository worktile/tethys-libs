import { DragDropRegistry, DragRef } from '@angular/cdk/drag-drop';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';

import { Inject, Injectable, NgZone, OnDestroy, DOCUMENT } from '@angular/core';
import { SafeAny } from 'ngx-tethys/types';
import { Subscription } from 'rxjs';

/**
 * Original service that keeps track of all the drag item and drop container
 * instances, and manages global event listeners on the `document` in DragDropRegistry.
 * Now, When the scrollable is scrolled, the service need to emits the event
 * to drag item and drop container instances.
 */

@Injectable()
export class ThyDragDropRegistry<I extends { previewClass?: string | string[] | undefined; isDragging(): boolean } & DragRef, C>
    extends DragDropRegistry
    implements OnDestroy
{
    private ngZone: NgZone;

    private _scrollSubscription: Subscription | null = null;

    constructor(
        _ngZone: NgZone,
        @Inject(DOCUMENT) _document: any,
        private _scrollDispatcher: ScrollDispatcher
    ) {
        super(_ngZone, _document);
        this.ngZone = _ngZone;
    }

    startDragging(drag: I, event: TouchEvent | MouseEvent) {
        super.startDragging(drag, event);

        // 订阅滚动
        this.ngZone.runOutsideAngular(() => {
            this._scrollSubscription = this._scrollDispatcher.scrolled().subscribe((event: void | CdkScrollable) => {
                if (event) {
                    this['_scroll'].next({ target: event.getElementRef().nativeElement } as SafeAny);
                }
            });
        });
    }

    unsubscribeScrolled() {
        if (this._scrollSubscription) {
            this._scrollSubscription.unsubscribe();
        }
    }

    stopDragging(drag: I) {
        super.stopDragging(drag);
        this.unsubscribeScrolled();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.unsubscribeScrolled();
    }
}
