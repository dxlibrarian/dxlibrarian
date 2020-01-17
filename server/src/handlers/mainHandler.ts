import { Request, Response } from '../constants';
import { wrapRequest } from '../utils/wrapRequest';
import { wrapResponse } from '../utils/wrapResponse';
import { checkPath } from '../utils/checkPath';
import { getLog } from '../utils/getLog';
import { authHandler } from './authHandler';
import { publishHandler } from './publishHandler';
import { readHandler } from './readHandler';
import { notFoundHandler } from './notFoundHandler';

function cors(res: Response) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
}

export async function mainHandler(originalReq: Request<any, any>, originalRes: Response) {
  const log = getLog('dxlibrarian:mainHandler');

  const req = wrapRequest(originalReq);
  const res = wrapResponse(originalRes);

  log.verbose('path:', req.path);
  log.verbose('method:', req.method);
  log.verbose('body:', req.body);
  log.verbose('query:', req.query);
  log.verbose('headers:', req.headers);

  try {
    // if (req.method === 'OPTIONS') {
    //   cors(res);
    //   res.status(200);
    //   res.end();
    //   return;
    // }

    switch (true) {
      case checkPath(req, '/auth/callback', ['GET', 'POST']): {
        return await authHandler(req, res);
      }
      case checkPath(req, '/auth', ['GET']): {
        return await authHandler(req, res);
      }
      case checkPath(req, '/api/publish', ['POST']): {
        cors(res);
        return await publishHandler(req, res);
      }
      case checkPath(req, '/api/read', ['GET']): {
        cors(res);
        return await readHandler(req, res);
      }
      default: {
        return await notFoundHandler(req, res);
      }
    }
  } catch (error) {
    if (error.code != null && error.code.constructor === Number) {
      log.debug('Error code:', error.code);
      res.status(error.code);
    } else {
      log.debug('Error code:', 500);
      res.status(500);
    }
    const stack = error.stack || 'Unknown error';
    log.debug('Error stack:', stack);
    res.end(stack);
  }
}
