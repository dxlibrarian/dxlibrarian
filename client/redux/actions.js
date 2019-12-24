import { LOGIN, AUTHORIZE } from './actionTypes';

export const login = jwtToken => ({
  type: LOGIN,
  payload: {
    jwtToken
  }
});

export const authorize = () => ({
  type: AUTHORIZE
});
