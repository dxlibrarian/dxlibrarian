import { Request, HTTPMethod } from '../constants';

export function checkPath(req: Request<any, any>, url: string, methods: Array<HTTPMethod>) {
  let lowerCasePath = req.path.toLowerCase();
  if (lowerCasePath[lowerCasePath.length - 1] !== '/') {
    lowerCasePath += '/';
  }

  let lowerCaseUrl = url.toLowerCase();
  if (lowerCaseUrl[lowerCaseUrl.length - 1] !== '/') {
    lowerCaseUrl += '/';
  }

  return methods.includes(req.method) && lowerCasePath === lowerCaseUrl;
}
