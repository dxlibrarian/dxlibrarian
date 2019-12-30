import Cookies from 'js-cookie';

import { LOGIN } from '../actionTypes';

export const loginMiddleware = () => next => action => {
  switch (action.type) {
    case LOGIN: {
      const { jwtToken } = action.payload;
      Cookies.set('jwtToken', jwtToken, { expires: 365 });
      break;
    }
    default:
  }
  next(action);
};
