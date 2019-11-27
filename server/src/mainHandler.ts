import { Request, Response } from './types';
import { wrapRequest } from './wrapRequest';
import { wrapResponse } from './wrapResponse';
import { checkPath } from './checkPath';
import { authHandler } from './authHandler';

export async function mainHandler(originalReq: Request, originalRes: Response) {
  const req = wrapRequest(originalReq);
  const res = wrapResponse(originalRes);

  switch (true) {
    case checkPath(req, '/auth/callback', ['GET', 'POST']): {
      return authHandler(req, res);
    }
    case checkPath(req, '/auth', ['GET']): {
      return authHandler(req, res);
    }
    case checkPath(req, '/qqq', ['GET']): {
      res.redirect('/');
      break;
    }
    case checkPath(req, '/www', ['GET']): {
      res.redirect('https://google.com');
      break;
    }

    default: {
      res.status(405);
      res.end(`Access error: path "${req.path}" is not addressable by current executor`);

      return;
    }
  }
}
