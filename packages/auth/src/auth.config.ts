import { AuthConfig } from './interface';
import { ConfigService } from './util/config/config.service';

export const DEFAULT_CONFIG: AuthConfig = {
  store_key: '_token',
  token_invalid_redirect: true,
  token_exp_offset: 10,
  token_send_key: 'token',
  token_send_template: '${token}',
  token_send_place: 'header',
  login_url: '/login',
  ignores: [/\/login/, /assets\//, /passport\//],
  allow_anonymous_key: '_allow_anonymous',
  executeOtherInterceptors: true,
  refreshTime: 3000,
  refreshOffset: 6000
};

export function mergeConfig(srv: ConfigService): AuthConfig {
  return srv.merge('auth', DEFAULT_CONFIG)!;
}
