import { join } from 'path';
import { Response } from './types';
import { APPLICATION_BASE_URL } from './constants';

// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
const regExp = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;
function isAbsoluteUrl(url: string): boolean {
  return regExp.test(url);
}

export function wrapResponse(res: Response): Response {
  function redirect(path: string, code?: number) {
    const wrappedPath = isAbsoluteUrl(path) ? path : join(APPLICATION_BASE_URL, path);

    return res.redirect(wrappedPath, code);
  }

  return Object.create(res, {
    redirect: {
      get(): any {
        return redirect;
      },
      set(value: any) {
        res.redirect = value;
      },
      enumerable: true
    }
  });
}
