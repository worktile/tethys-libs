import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig, AuthSafeAny, AUTH_SERVICE_TOKEN } from '../../interface';
import { BaseInterceptor } from '../base.interceptor';
import { CheckSimple } from '../helper';
import { SimpleTokenModel } from './simple.model';

@Injectable()
export class SimpleInterceptor extends BaseInterceptor {
  isAuth(_options: AuthConfig): boolean {
    this.model = this.injector.get(AUTH_SERVICE_TOKEN).get() as SimpleTokenModel;
    return CheckSimple(this.model as SimpleTokenModel);
  }

  setReq(req: HttpRequest<any>, options: AuthConfig) {
    const { token_send_template, token_send_key } = options;
    const token = token_send_template!.replace(/\$\{([\w]+)\}/g, (_: string, g) => this.model[g]);
    switch (options.token_send_place) {
      case 'header':
        const obj: AuthSafeAny = {};
        obj[token_send_key!] = token;
        req = req.clone({
          setHeaders: obj
        });
        break;
      case 'body':
        const body = req.body || {};
        body[token_send_key!] = token;
        req = req.clone({
          body
        });
        break;
      case 'url':
        req = req.clone({
          params: req.params.append(token_send_key!, token)
        });
        break;
    }
    return req;
  }
}
