import Cookies from 'js-cookie';

import { AUTHORIZE } from '../actionTypes';
import { API_GATEWAY_URL } from '../../constants';

export const authorizeMiddleware = store => next => action => {
  switch (action.type) {
    case AUTHORIZE: {
      window.location = `${API_GATEWAY_URL}/auth`
      break;
    }
    default:
  }
  next(action);
};
