import { LOGIN } from '../actionTypes';

export const jwt = (state = {}, action) => {
  switch (action.type) {
    case LOGIN: {
      const { jwtToken } = action.payload;
      return jwtToken;
    }
    default: {
      return state;
    }
  }
};
