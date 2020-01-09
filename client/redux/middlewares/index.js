import { loginMiddleware } from './loginMiddleware';
import { authorizeMiddleware } from './authorizeMiddleware';
import { searchMiddleware } from './searchMiddleware';

export const middlewares = [loginMiddleware, authorizeMiddleware, searchMiddleware];
