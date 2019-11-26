import {CookieSerializeOptions} from 'cookie'

const options: CookieSerializeOptions = {
  maxAge: 31536000000
}

export const jwtCookie = {
  name: 'jwt',
  options
};
