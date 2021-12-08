import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Injectable, Injector, Optional } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { mergeConfig } from '../auth.config';
import { AuthConfig, AuthSafeAny, AuthTokenModel } from '../interface';
import { ConfigService } from '../util/config/config.service';
import { ToLogin } from './helper';

class HttpAuthInterceptorHandler implements HttpHandler {
  constructor(private next: HttpHandler, private interceptor: HttpInterceptor) {}
  
  handle(req: HttpRequest<AuthSafeAny>): Observable<HttpEvent<AuthSafeAny>> {
    return this.interceptor.intercept(req, this.next);
  }
}
  

@Injectable()
export abstract class BaseInterceptor implements HttpInterceptor {
  constructor(@Optional() protected injector: Injector) {}

  protected model!: AuthTokenModel;

  abstract isAuth(options: AuthConfig): boolean;

  abstract setReq(req: HttpRequest<AuthSafeAny>, options: AuthConfig): HttpRequest<AuthSafeAny>;

  intercept(req: HttpRequest<AuthSafeAny>, next: HttpHandler): Observable<HttpEvent<AuthSafeAny>> {
    const options = mergeConfig(this.injector.get(ConfigService));
    if (Array.isArray(options.ignores)) {
      for (const item of options.ignores) {
        if (item.test(req.url)) return next.handle(req);
      }
    }
    const ingoreKey = options.allow_anonymous_key!;
    let ingored = false;
    let params = req.params;
    let url = req.url;
    if (req.params.has(ingoreKey)) {
      params = req.params.delete(ingoreKey);
      ingored = true;
    }
    const urlArr = req.url.split('?');
    if (urlArr.length > 1) {
      const queryStringParams = new HttpParams({ fromString: urlArr[1] });
      if (queryStringParams.has(ingoreKey)) {
        const queryString = queryStringParams.delete(ingoreKey).toString();
        url = queryString.length > 0 ? `${urlArr[0]}?${queryString}` : urlArr[0];
        ingored = true;
      }
    }
    if (ingored) {
      return next.handle(req.clone({ params, url }));
    }

    if (this.isAuth(options)) {
      req = this.setReq(req, options);
    } else {
      ToLogin(options, this.injector);
      const err$ = new Observable((observer: Observer<HttpEvent<AuthSafeAny>>) => {
        const res = new HttpErrorResponse({
          url: req.url,
          headers: req.headers,
          status: 401,
          statusText: '所请求URL未授权'
        });
        observer.error(res);
      });
      if (options.executeOtherInterceptors) {
        const interceptors = this.injector.get(HTTP_INTERCEPTORS, []);
        const lastInterceptors = interceptors.slice(interceptors.indexOf(this) + 1);
        if (lastInterceptors.length > 0) {
          const chain = lastInterceptors.reduceRight(
            (_next, _interceptor) => new HttpAuthInterceptorHandler(_next, _interceptor),
            {
              handle: (_: HttpRequest<AuthSafeAny>) => err$
            }
          );
          return chain.handle(req);
        }
      }
      return err$;
    }
    return next.handle(req);
  }
}
