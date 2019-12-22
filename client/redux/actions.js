import { LOGIN } from './actionTypes';

export const login = jwtToken => ({
  type: LOGIN,
  payload: {
    jwtToken
  }
});
