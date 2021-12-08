import { AuthSafeAny, AuthTokenModel } from '../../interface';

export class SimpleTokenModel implements AuthTokenModel {
  [key: string]: AuthSafeAny;

  token!: string;

  expired?: number;
}
