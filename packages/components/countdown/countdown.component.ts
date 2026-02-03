import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    input,
    OnDestroy,
    OnInit,
    signal,
    WritableSignal
} from '@angular/core';
import { injectLocale, ThyI18nPipe } from '@tethys/pro/i18n';
import { ThyButtonModule } from 'ngx-tethys/button';
import { coerceBooleanProperty } from 'ngx-tethys/util';
import { interval, Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Component({
    selector: 'thy-countdown',
    templateUrl: 'countdown.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'thy-countdown'
    },
    imports: [ThyButtonModule, ThyI18nPipe]
})
export class ThyCountdownComponent implements OnInit, OnDestroy {
    locale = injectLocale();

    readonly text = input(this.locale().getSMSCode);

    readonly disabled = input(false, { transform: coerceBooleanProperty });

    readonly sendAction = input<() => Observable<boolean>>(() => of(false));

    public readonly seconds: WritableSignal<number> = signal(0);

    public subscription: any;

    private readonly time: WritableSignal<number> = signal(60);

    constructor() {}

    ngOnInit() {}

    onClick() {
        if (this.disabled()) {
            return;
        }
        this.start();
    }

    private start() {
        this.seconds.set(this.time());
        this.subscription = interval(1000)
            .pipe(
                take(this.time()),
                map((value: number) => this.time() - 1 - value)
            )
            .subscribe((value: number) => {
                this.seconds.set(value);
            });

        const sendAction = this.sendAction();
        if (sendAction) {
            sendAction()
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
        this.time.set(60);
        this.seconds.set(0);
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
