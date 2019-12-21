import { exceptions } from './exceptions';

export function isUser(user: {
  accountEnabled: boolean;
  assignedLicenses?: Array<any>;
  mail?: string;
  id?: string;
  displayName?: string;
  userPrincipalName?: string;
}) {
  const isEnabled =
    user.mail &&
    user.accountEnabled &&
    user.assignedLicenses &&
    user.assignedLicenses.length > 0 &&
    user.id &&
    user.displayName &&
    user.userPrincipalName;

  return isEnabled && !exceptions.includes(user.displayName);
}
