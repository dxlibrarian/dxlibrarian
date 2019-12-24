import { loginMiddleware } from './loginMiddleware';
import { authorizeMiddleware } from './authorizeMiddleware';

export const middlewares = [loginMiddleware, authorizeMiddleware];
