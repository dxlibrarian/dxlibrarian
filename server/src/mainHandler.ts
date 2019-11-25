import { OIDCStrategy } from 'passport-azure-ad';

import { Request, Response, HTTPMethod } from './types';
import { jwtCookie } from './jwtCookie';
import { authOptions, authCallback } from './auth';

function checkPath(req: Request, url: string, methods: Array<HTTPMethod>) {
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

export async function mainHandler(originalReq: Request, res: Response) {
  const req: Request = Object.create(originalReq, {
    path: {
      get() {
        return originalReq.path.replace(/^\/DXLibrarian/, '');
      },
      set(value: string) {
        return (originalReq.path = value);
      },
      enumerable: true
    }
  });

  let jwtToken = req.cookies[jwtCookie.name];

  if (req.headers && req.headers.authorization) {
    jwtToken = req.headers.authorization.replace(/^Bearer /i, '');
  }

  req.jwtToken = jwtToken;

  if (jwtToken) {
    res.setHeader('Authorization', `Bearer ${jwtToken}`);
  }

  switch (true) {
    case checkPath(req, '/auth', ['GET', 'POST']): {
      const authStrategy = new OIDCStrategy(authOptions, authCallback);

      await new Promise(resolve => {



        Object.defineProperty(authStrategy, 'success', {
          value: function(user:any, info:any) {
            console.log({user, info});

            const jwtToken = JSON.stringify({user, info})

            res.cookie(jwtCookie.name, jwtToken, jwtCookie.options)

            // res.redirect(
            //  '/prod/DXLibrarian/'
            // )


            res.json({user, info});
            resolve()
          }
        })
        Object.defineProperty(authStrategy, 'fail', {
          value: function(challenge:any, status:any) {
            console.log({challenge, status});
            res.redirect(challenge, status)
            resolve()
          }
        })
        Object.defineProperty(authStrategy, 'redirect', {
          value: function(url:any, status:any) {
            console.log({url, status});
            res.redirect(url, status)
            resolve()
          }
        })
        Object.defineProperty(authStrategy, 'pass', {
          value: function() {
          console.log('pass');
          res.end('pass');
          resolve()}
        })

        authStrategy.authenticate(req as any, { response: res, failureRedirect: '/prod/DXLibrarian/error' });

      })

      break;
    }
    case checkPath(req, '/auth/callback', ['GET', 'POST']): {
      res.end('/auth/callback');
      break;
    }

    default: {
      await res.status(405);
      await res.end(`Access error: path "${req.path}" is not addressable by current executor`);

      return;
    }
  }
}
