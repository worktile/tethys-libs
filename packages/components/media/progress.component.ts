import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { useHostRenderer } from '@tethys/cdk/dom';
import { MixinBase, mixinUnsubscribe } from 'ngx-tethys/core';
import { ThySliderType } from 'ngx-tethys/slider';
import { clamp } from 'ngx-tethys/util';
import { Observable, Subscription, distinctUntilChanged, fromEvent, map, pluck, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'thy-media-progress',
    host: {
        class: 'thy-media-progress',
        '[class.thy-media-progress-vertical]': 'thyDirection === "vertical"',
        '[class.thy-media-progress-horizontal]': 'thyDirection === "horizontal"'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="thy-media-progress-rail" #progressRail>
            <div class="thy-media-progress-track" #progressTrack>
                <div class="thy-media-progress-pointer" #progressPointer></div>
            </div>
            <div class="thy-media-progress-buffer" #progressBuffer></div>
        </div>
    `,
    standalone: true
})
export class ThyMediaProgressComponent extends mixinUnsubscribe(MixinBase) implements OnInit, AfterViewInit {
    @ViewChild('progressRail', { static: true }) progressRail: ElementRef | undefined;

    @ViewChild('progressTrack', { static: true }) progressTrack: ElementRef | undefined;

    @ViewChild('progressBuffer', { static: true }) progressBuffer: ElementRef | undefined;

    /**
     * 进度值
     */
    @Input() set thyProgressValue(value: number) {
        this.setValue(value);
    }

    /**
     * 缓存值
     */
    @Input() set thyBufferedValue(value: number) {
        if (this.progressBuffer && value) {
            const validValue = value <= 0 ? 0 : value >= 100 ? 100 : value;
            (this.progressBuffer as ElementRef).nativeElement.style[this.dimension] = `${validValue}%`;
        }
    }

    /**
     * 进度条方向
     */
    @Input() thyDirection: 'horizontal' | 'vertical' = 'horizontal';

    /**
     * 进度主题类型 primary | success | info | warning | danger
     */
    @Input() set thyProgressType(type: ThySliderType | undefined) {
        if (type) {
            if (this.typeClassName) {
                this.hostRenderer.removeClass(this.typeClassName);
            }
            this.hostRenderer.addClass(type ? `thy-media-progress-${type}` : '');
            this.typeClassName = `thy-media-progress-${type}`;
        }
    }

    /**
     * 移动结束后回调
     */
    @Output() thyAfterChange = new EventEmitter<number>();

    /**
     * 移动开始
     */
    @Output() thyMoveStart = new EventEmitter<void>();

    /**
     * 移动结束
     */
    @Output() thyMoveEnd = new EventEmitter<void>();

    get dimension() {
        return this.thyDirection === 'horizontal' ? 'width' : 'height';
    }

    private dragStartListener: Observable<number> | undefined;

    private dragMoveListener: Observable<number> | undefined;

    private dragEndListener: Observable<Event> | undefined;

    private dragStartHandler: Subscription | undefined;

    private dragMoveHandler: Subscription | undefined;

    private dragEndHandler: Subscription | undefined;

    private hostRenderer = useHostRenderer();

    typeClassName = '';

    progressValue = 0;

    constructor(private cdr: ChangeDetectorRef, private ref: ElementRef, private ngZone: NgZone) {
        super();
    }

    ngOnInit(): void {
        this.subscribeMouseListeners(['start']);
    }

    ngAfterViewInit() {
        this.registerMouseEventsListeners();
        this.subscribeMouseListeners(['start']);
    }

    private setValue(value: number) {
        if (this.progressValue !== value) {
            this.progressValue = value <= 0 ? 0 : value >= 100 ? 100 : value;
            this.updateTrackAndPointer();
        }
    }

    private updateTrackAndPointer() {
        (this.progressTrack as ElementRef).nativeElement.style[this.dimension] = `${this.progressValue}%`;
        this.cdr.markForCheck();
    }

    private unsubscribeMouseListeners(actions: string[] = ['start', 'move', 'end']) {
        if (actions.includes('start') && this.dragStartHandler) {
            this.dragStartHandler.unsubscribe();
            this.dragStartHandler = undefined;
        }
        if (actions.includes('move') && this.dragMoveHandler) {
            this.dragMoveHandler.unsubscribe();
            this.dragMoveHandler = undefined;
        }
        if (actions.includes('end') && this.dragEndHandler) {
            this.dragEndHandler.unsubscribe();
            this.dragEndHandler = undefined;
        }
    }

    private subscribeMouseListeners(actions: string[] = ['start', 'move', 'end']) {
        if (actions.includes('start') && this.dragStartListener && !this.dragStartHandler) {
            this.dragStartHandler = this.dragStartListener.subscribe(this.mouseStartMoving.bind(this));
        }

        if (actions.includes('move') && this.dragMoveListener && !this.dragMoveHandler) {
            this.dragMoveHandler = this.dragMoveListener.subscribe(this.mouseMoving.bind(this));
        }

        if (actions.includes('end') && this.dragEndListener && !this.dragEndHandler) {
            this.dragEndHandler = this.dragEndListener.subscribe(this.mouseStopMoving.bind(this));
        }
    }

    private mouseStartMoving(value: number) {
        this.pointerController(true);
        this.setValue(value);
    }

    private mouseMoving(value: number) {
        this.setValue(value);
        this.cdr.markForCheck();
    }

    private mouseStopMoving(): void {
        this.pointerController(false);
        this.cdr.markForCheck();
        this.thyAfterChange.emit(this.progressValue);
    }

    private pointerController(movable: boolean) {
        if (movable) {
            this.subscribeMouseListeners(['move', 'end']);
        } else {
            this.unsubscribeMouseListeners(['move', 'end']);
        }
    }

    private registerMouseEventsListeners() {
        const dimension = this.thyDirection === 'vertical' ? 'pageY' : 'pageX';
        this.dragStartListener = this.ngZone.runOutsideAngular(() => {
            return (fromEvent(this.ref.nativeElement, 'mousedown') as Observable<MouseEvent>).pipe(
                tap((e: MouseEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                }),
                pluck(dimension),
                map((position: number, index) => this.mousePositionToAdaptiveValue(position)),
                tap(() => {
                    this.thyMoveStart.emit();
                })
            );
        });

        this.dragEndListener = this.ngZone.runOutsideAngular(() => {
            return fromEvent(document, 'mouseup').pipe(
                tap(() => {
                    this.thyMoveEnd.emit();
                })
            );
        });

        this.dragMoveListener = this.ngZone.runOutsideAngular(() => {
            const dimension = this.thyDirection === 'vertical' ? 'pageY' : 'pageX';
            return (fromEvent(document, 'mousemove') as Observable<MouseEvent>).pipe(
                tap((e: MouseEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.thyMoveStart.emit();
                }),
                pluck(dimension),
                map((position: number) => this.mousePositionToAdaptiveValue(position)),
                distinctUntilChanged(),
                tap(() => {
                    this.thyMoveStart.emit();
                }),
                takeUntil(this.dragEndListener as Observable<Event>)
            );
        });
    }

    private mousePositionToAdaptiveValue(position: number): number {
        const dimension = this.thyDirection === 'vertical' ? 'clientHeight' : 'clientWidth';
        const progressStartPosition = this.getProgressPagePosition();
        const progressLength = (this.progressRail as ElementRef).nativeElement[dimension];
        const ratio = this.convertPointerPositionToRatio(position, progressStartPosition, progressLength);
        return parseFloat((ratio * 100).toFixed(2));
    }

    private getProgressPagePosition(): number {
        const rect = this.ref.nativeElement.getBoundingClientRect();
        const window = this.ref.nativeElement.ownerDocument.defaultView;
        const orientFields: string[] = this.thyDirection === 'vertical' ? ['bottom', 'pageYOffset'] : ['left', 'pageXOffset'];
        // const orientFields: string[] = ['left', 'pageXOffset'];
        return rect[orientFields[0]] + window[orientFields[1]];
    }

    private convertPointerPositionToRatio(pointerPosition: number, startPosition: number, totalLength: number) {
        return clamp(Math.abs(pointerPosition - startPosition) / totalLength, 0, 1);
    }

    ngOnDestroy(): void {
        this.unsubscribeMouseListeners();
        super.ngOnDestroy();
    }
}
