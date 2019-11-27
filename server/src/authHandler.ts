import { sign } from 'jsonwebtoken';

import { Request, Response } from './types';
import { authStrategy } from './authStrategy';
import { getLog } from './getLog';
import { CLIENT_ORIGIN, JWT_SECRET } from './constants';

export async function authHandler(req: Request, res: Response) {
  const log = getLog('dxlibrarian:authHandler');

  log.debug('Auth strategy. Start');

  const failureRedirect = '/error';

  await new Promise(resolve => {
    Object.defineProperties(authStrategy, {
      success: {
        value: function(user: object) {
          const jwtToken = sign(user, JWT_SECRET, { noTimestamp: true });

          const redirectUrl = Object(req.body)?.state?.split(':::')[1] || '/';

          res.redirect(encodeURI(`${CLIENT_ORIGIN}${redirectUrl}?jwtToken=${jwtToken}`));
          resolve();
        },
        enumerable: true,
        configurable: true,
        writable: true
      },
      error: {
        value: function(error: Error) {
          log.debug('Auth strategy. Error');
          log.error(error);
          res.redirect(failureRedirect);
          resolve();
        },
        enumerable: true,
        configurable: true,
        writable: true
      },
      fail: {
        value: function(challenge: any, status: any) {
          log.debug('Auth strategy. Fail');
          log.error(challenge, status);
          res.redirect(failureRedirect, status);
          resolve();
        },
        enumerable: true,
        configurable: true,
        writable: true
      },
      redirect: {
        value: function(url: any, status: any) {
          log.debug('Auth strategy. Redirect');
          log.debug(url, status);
          res.redirect(url, status);
          resolve();
        },
        enumerable: true,
        configurable: true,
        writable: true
      },
      pass: {
        value: function() {
          log.debug('Auth strategy. Pass');
          res.end();
          resolve();
        },
        enumerable: true,
        configurable: true,
        writable: true
      }
    });

    const redirectUrl = req.query.redirectUrl == null ? '/' : req.query.redirectUrl;
    authStrategy.authenticate(req as any, {
      response: res,
      failureRedirect,
      session: false,
      customState: `:::${redirectUrl}`
    });
  });

  log.debug('Auth strategy. End');
}
