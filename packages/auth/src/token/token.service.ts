import { Inject, inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subject, Subscription } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';
import { mergeConfig } from '../auth.config';
import { AuthConfig, AuthReferrer, AuthSafeAny, AuthTokenModel, AuthTokenService } from '../interface';
import { AuthStore, AUTH_STORE_TOKEN } from '../store/interface';
import { ConfigService } from '../util/config/config.service';

export function AUTH_SERVICE_TOKEN_FACTORY(): AuthTokenService {
  return new TokenService(inject(ConfigService), inject(AUTH_STORE_TOKEN));
}

@Injectable()
export class TokenService implements AuthTokenService, OnDestroy {
  private refresh$ = new Subject<AuthTokenModel>();
  private change$ = new BehaviorSubject<AuthTokenModel | null>(null);
  private interval$: Subscription = new Subscription();
  private _options: AuthConfig;
  private _referrer: AuthReferrer = {};

  constructor(configSrv: ConfigService, @Inject(AUTH_STORE_TOKEN) private store: AuthStore) {
    this._options = mergeConfig(configSrv);
  }

  get refresh(): Observable<AuthTokenModel> {
    this.builderRefresh();
    return this.refresh$.pipe(share());
  }

  get login_url(): string | undefined {
    return this._options.login_url;
  }

  get referrer(): AuthReferrer {
    return this._referrer;
  }

  get options(): AuthConfig {
    return this._options;
  }

  set(data: AuthTokenModel): boolean {
    const res = this.store.set(this._options.store_key!, data);
    this.change$.next(data);
    return res;
  }

  get(type?: AuthSafeAny): AuthSafeAny;
  get<T extends AuthTokenModel>(type?: new () => T): T {
    const data = this.store.get(this._options.store_key!);
    return type ? (Object.assign(new type(), data) as T) : (data as T);
  }

  clear(options: { onlyToken: boolean } = { onlyToken: false }): void {
    let data: AuthTokenModel | null = null;
    if (options.onlyToken === true) {
      data = this.get() as AuthTokenModel;
      data.token = '';
      this.set(data);
    } else {
      this.store.remove(this._options.store_key!);
    }
    this.change$.next(data);
  }

  change(): Observable<AuthTokenModel | null> {
    return this.change$.pipe(share());
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
          const item = this.get() as AuthTokenModel;
          const expired = item.expired || item.exp || 0;
          if (expired <= 0) {
            return null;
          }

          const curTime = new Date().valueOf() + refreshOffset!;
          return expired <= curTime ? item : null;
        }),
        filter((v) => v != null),
      )
      .subscribe((res) => this.refresh$.next(res!));
  }

  ngOnDestroy(): void {
    this.cleanRefresh();
  }
}
