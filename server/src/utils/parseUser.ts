import { verify } from 'jsonwebtoken';

import { JWT_SECRET, DXLibrarianUser } from '../constants';

export function parseUser(jwtToken: string, options?: { isAdmin: boolean }): DXLibrarianUser {
  const { isAdmin = false } = options == null ? {} : options;
  const user = verify(jwtToken, JWT_SECRET) as DXLibrarianUser;
  if (user.isAdmin !== true) {
    user.isAdmin = false;
  }
  if (isAdmin && !user.isAdmin) {
    throw new Error(`User "${user.name}" must be an admin`);
  }
  return user;
}
