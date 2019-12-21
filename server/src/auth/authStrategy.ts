import {
  OIDCStrategy,
  IOIDCStrategyOptionWithRequest,
  IProfile,
  VerifyCallback,
  VerifyOIDCFunctionWithReq
} from 'passport-azure-ad';
import tcomb from 'tcomb-validation';

import { GATEWAY_ORIGIN, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET } from '../constants';
import { prepareDisplayName } from './prepareDisplayName';
import { prepareEmail } from './prepareEmail';
import { prepareOID } from './prepareOID';
import { validate } from '../utils/validate';
import { DXLibrarianUser } from '../types';

export const authOptions: IOIDCStrategyOptionWithRequest = {
  redirectUrl: `${GATEWAY_ORIGIN}/auth/callback`,
  clientID: AZURE_CLIENT_ID,
  clientSecret: AZURE_CLIENT_SECRET,
  responseType: 'id_token code',
  responseMode: 'form_post',
  identityMetadata: 'https://login.microsoftonline.com/common/.well-known/openid-configuration',
  validateIssuer: false,
  allowHttpForRedirectUrl: false,
  loggingLevel: 'info',
  useCookieInsteadOfSession: true,
  cookieEncryptionKeys: [
    {
      key: '12345678901234567890123456789012',
      iv: '123456789012'
    }
  ],
  passReqToCallback: true
};

export const authCallback: VerifyOIDCFunctionWithReq = (_: any, profile: IProfile, done: VerifyCallback) => {
  validate(
    profile,
    tcomb.struct({
      displayName: tcomb.String,
      upn: tcomb.String,
      oid: tcomb.String
    })
  );

  const user: DXLibrarianUser = {
    userId: prepareOID(profile.oid),
    name: prepareDisplayName(profile.displayName),
    email: prepareEmail(profile.upn)
  };

  done(null, user);
};

export const authStrategy = new OIDCStrategy(authOptions, authCallback);
