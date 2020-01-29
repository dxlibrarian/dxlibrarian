import { sign } from 'jsonwebtoken';

import { JWT_SECRET, DXLibrarianUser } from '../constants';

export function getRootJwtToken() {
  const user: DXLibrarianUser = {
    userId: '4e204bb28bff4279bebcdd6a',
    name: 'Anton Zhukov',
    email: 'anton.zhukov@devexpress.com',
    isAdmin: true
  };
  const jwtToken = sign(user, JWT_SECRET, { noTimestamp: true });
  return jwtToken;
}
