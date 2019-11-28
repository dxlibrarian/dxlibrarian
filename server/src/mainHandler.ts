import { Request, Response } from './types';
import { wrapRequest } from './wrapRequest';
import { wrapResponse } from './wrapResponse';
import { checkPath } from './checkPath';
import { authHandler } from './authHandler';
import { publishHandler } from './publishHandler';
import { readHandler } from './readHandler';

export async function mainHandler(originalReq: Request<any, any>, originalRes: Response) {
  const req = wrapRequest(originalReq);
  const res = wrapResponse(originalRes);

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
        res.status(405);
        res.end(`Access error: path "${req.path}" is not addressable by current executor`);

        return;
      }
    }
  } catch (error) {
    if (error.code != null && error.code.constructor === Number) {
      res.status(error.code);
    } else {
      res.status(500);
    }
    res.end(error.stack);
  }
}
