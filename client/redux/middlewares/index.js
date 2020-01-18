import { loginMiddleware } from './loginMiddleware';
import { authorizeMiddleware } from './authorizeMiddleware';
import { searchMiddleware } from './searchMiddleware';
import { settingsMiddleware } from './settingsMiddleware';

export const middlewares = [loginMiddleware, authorizeMiddleware, searchMiddleware, settingsMiddleware];
