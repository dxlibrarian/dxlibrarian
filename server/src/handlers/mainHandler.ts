import { Request, Response } from '../constants';
import { wrapRequest } from '../utils/wrapRequest';
import { wrapResponse } from '../utils/wrapResponse';
import { checkPath } from '../utils/checkPath';
import { getLog } from '../utils/getLog';
import { authHandler } from './authHandler';
import { publishHandler } from './publishHandler';
import { readHandler } from './readHandler';
import { notFoundHandler } from './notFoundHandler';

export async function mainHandler(originalReq: Request<any, any>, originalRes: Response) {
  const log = getLog('dxlibrarian:mainHandler');

  const req = wrapRequest(originalReq);
  const res = wrapResponse(originalRes);

  log.verbose('path:', req.path);
  log.verbose('body:', req.body);
  log.verbose('query:', req.query);

  try {
    switch (true) {
      case checkPath(req, '/auth/callback', ['GET', 'POST']): {
        return await authHandler(req, res);
      }
      case checkPath(req, '/auth', ['GET']): {
        return await authHandler(req, res);
      }
      case checkPath(req, '/api/publish', ['POST']): {
        return await publishHandler(req, res);
      }
      case checkPath(req, '/api/read', ['GET']): {
        return await readHandler(req, res);
      }
      default: {
        return await notFoundHandler(req, res);
      }
    }
  } catch (error) {
    if (error.code != null && error.code.constructor === Number) {
      res.status(error.code);
    } else {
      res.status(500);
    }
    res.end(error.stack || 'Unknown error');
  }
}
