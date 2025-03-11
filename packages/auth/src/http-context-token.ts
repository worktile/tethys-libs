import { HttpContextToken } from '@angular/common/http';

export const ALLOW_ANONYMOUS = new HttpContextToken(() => false);
