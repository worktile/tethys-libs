import { Component, HostBinding, Input, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { interval, Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { ThyButtonModule } from 'ngx-tethys/button';

@Component({
    selector: 'thy-countdown',
    templateUrl: 'countdown.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'thy-countdown'
    },
    standalone: true,
    imports: [ThyButtonModule]
})
export class ThyCountdownComponent implements OnInit, OnDestroy {
    @Input() text = '获取短信验证码';

    @Input() disabled = false;

    @Input() sendAction: () => Observable<boolean> = () => of(false);

    public seconds = 0;

    public subscription: any;

    public get started() {
        return this.seconds !== 0;
    }

    private time = 60;

    constructor() {}

    ngOnInit() {}

    onClick() {
        if (this.disabled) {
            return;
        }
        this.start();
    }

    private start() {
        this.seconds = this.time;
        this.subscription = interval(1000)
            .pipe(
                take(this.time),
                map((value: number) => this.time - 1 - value)
            )
            .subscribe((value: number) => {
                this.seconds = value;
            });

        if (this.sendAction) {
            this.sendAction()
                .pipe(
                    catchError(() => {
                        this.reset();
                        return of(null);
                    })
                )
                .subscribe((data: any) => {
                    if (!data) {
                        this.reset();
                    }
                });
        }
    }

    reset() {
        this.time = 60;
        this.seconds = 0;
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
