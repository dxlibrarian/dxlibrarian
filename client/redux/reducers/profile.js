import { LOGIN } from '../actionTypes';

function atob(s) {
  var e = {},
    i,
    b = 0,
    c,
    x,
    l = 0,
    a,
    r = '',
    w = String.fromCharCode,
    L = s.length;
  var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (i = 0; i < 64; i++) {
    e[A.charAt(i)] = i;
  }
  for (x = 0; x < L; x++) {
    c = e[s.charAt(x)];
    b = (b << 6) + c;
    l += 6;
    while (l >= 8) {
      ((a = (b >>> (l -= 8)) & 0xff) || x < L - 2) && (r += w(a));
    }
  }
  return r;
}

function parseJwtToken(jwtToken) {
  try {
    return JSON.parse(atob(decodeURIComponent(profile).split('.')[1]));
  } catch (e) {
    return {};
  }
}

export const profile = (state = {}, action) => {
  switch (action.type) {
    case LOGIN: {
      const { jwtToken } = action.payload;
      const profile = parseJwtToken(jwtToken);
      return profile;
    }
    default: {
      return state;
    }
  }
};
