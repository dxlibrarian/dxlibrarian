import { IOIDCStrategyOptionWithRequest, IProfile, VerifyCallback, VerifyOIDCFunctionWithReq } from 'passport-azure-ad';
import { APPLICATION_ORIGIN, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET } from './constants';

export const authOptions: IOIDCStrategyOptionWithRequest = {
  redirectUrl: `${APPLICATION_ORIGIN}/auth/callback`,
  clientID: AZURE_CLIENT_ID,
  clientSecret: AZURE_CLIENT_SECRET,
  responseType: 'id_token code',
  responseMode: 'form_post',
  identityMetadata: 'https://login.microsoftonline.com/common/.well-known/openid-configuration',
  validateIssuer: false,
  allowHttpForRedirectUrl: true,
  useCookieInsteadOfSession: true,
  cookieEncryptionKeys: [
    {
      key: '12345678901234567890123456789012',
      iv: '123456789012'
    }
  ],
  passReqToCallback: true
};

export const authCallback: VerifyOIDCFunctionWithReq = (req: any, profile: IProfile, done: VerifyCallback) => {
  console.log('upn', profile.upn);
  done('JWT');
};
