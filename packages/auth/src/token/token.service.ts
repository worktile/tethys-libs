import { Inject, Injectable, OnDestroy, Optional } from '@angular/core';
import { BehaviorSubject, filter, interval, map, Observable, of, share, Subject, Subscription } from 'rxjs';
import { ThyTokenStorage } from './token-storage.service';
import { ThyAuthToken } from './token';
import { mergeConfig, THY_AUTH_CONFIG } from '../auth.config';
import { SafeAny } from '../types';
import { ThyAuthConfig } from '../auth.config';

@Injectable()
export class ThyTokenService implements OnDestroy {
    protected token$ = new BehaviorSubject<ThyAuthToken | null>(null);
    private _options: ThyAuthConfig;
    private interval$: Subscription = new Subscription();
    private refresh$ = new Subject<ThyAuthToken>();

    constructor(protected tokenStorage: ThyTokenStorage, @Optional() @Inject(THY_AUTH_CONFIG) config?: ThyAuthConfig) {
        this._options = mergeConfig(config);
        this.publishStoredToken();
    }

    get refresh(): Observable<ThyAuthToken> {
        this.builderRefresh();
        return this.refresh$.pipe(share());
    }

    get options(): ThyAuthConfig {
        return this._options;
    }

    get loginUrl(): string {
        return this._options.loginUrl!;
    }

    get(type?: SafeAny): SafeAny;

    /**
     * Returns observable of current token
     * @returns {Observable<ThyAuthToken>}
     */
    get(): Observable<ThyAuthToken> {
        const token = this.tokenStorage.get(this.options.tokenStoreKey!);
        return of(token);
    }

    /**
     * Sets a token into the storage. This method is used by the NbAuthService automatically.
     *
     * @param {ThyAuthToken} token
     * @returns {Observable<any>}
     */
    set(token: ThyAuthToken): Observable<null> {
        this.tokenStorage.set(this.options.tokenStoreKey!, token);
        this.publishStoredToken();
        return of(null);
    }

    /**
     * Removes the token and published token value
     *
     * @returns {Observable<any>}
     */

    clear(): Observable<null> {
        this.tokenStorage.clear(this.options.tokenStoreKey!);
        this.publishStoredToken();
        return of(null);
    }

    /**
     * Publishes token when it changes.
     * @returns {Observable<ThyAuthToken>}
     */
    tokenChange(): Observable<ThyAuthToken | null> {
        return this.token$.pipe(
            filter((value) => !!value),
            share()
        );
    }

    protected publishStoredToken() {
        this.token$.next(this.tokenStorage.get(this.options.tokenStoreKey!));
    }

    private cleanRefresh(): void {
        if (this.interval$ && !this.interval$.closed) {
            this.interval$.unsubscribe();
        }
    }

    private builderRefresh(): void {
        const { refreshTime, refreshOffset } = this._options;
        this.cleanRefresh();
        this.interval$ = interval(refreshTime)
            .pipe(
                map(() => {
                    const item = this.get() as any;
                    const expired = item.getTokenExpDate() || 0;
                    if (expired <= 0) {
                        return null;
                    }

                    const curTime = new Date().valueOf() + refreshOffset!;
                    return expired <= curTime ? item : null;
                }),
                filter((v) => v != null)
            )
            .subscribe((res) => this.refresh$.next(res!));
    }

    ngOnDestroy(): void {
        this.cleanRefresh();
    }
}
