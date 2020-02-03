import { loginMiddleware } from './loginMiddleware';
import { authorizeMiddleware } from './authorizeMiddleware';
import { searchMiddleware } from './searchMiddleware';
import { settingsMiddleware } from './settingsMiddleware';
import { publishMiddleware } from './publishMiddleware';
import { getBookInfoByIdMiddleware } from './getBookInfoByIdMiddleware';

export const middlewares = [
  loginMiddleware,
  authorizeMiddleware,
  searchMiddleware,
  settingsMiddleware,
  publishMiddleware,
  getBookInfoByIdMiddleware
];
