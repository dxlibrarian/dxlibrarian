import { prepareDisplayName } from './prepareDisplayName';
import { prepareOID } from './prepareOID';
import { prepareEmail } from './prepareEmail';
import { AzureUser, DXLibrarianUser } from '../types';

export function prepareUser(user: AzureUser): DXLibrarianUser {
  return {
    userId: prepareOID(user.id),
    name: prepareDisplayName(user.displayName),
    email: prepareEmail(user.userPrincipalName)
  };
}
