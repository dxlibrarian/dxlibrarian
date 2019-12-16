import md5 from 'md5';
import axios from 'axios';

import ClientCredentials from 'client-credentials';
import GraphService from 'graph-service';

import { INT_DX_AUTH, AVATAR_SALT, AZURE_CLIENT_SECRET, AZURE_CLIENT_ID, AZURE_CLIENT_TENANT } from '../constants';

const azureCredentials = new ClientCredentials(AZURE_CLIENT_TENANT, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET);

const graphService = new GraphService(azureCredentials, 'beta');

const exceptions = [
  'Mailbox Abuse',
  'DevExpress Client Services',
  'ClientServices365',
  'dxtalk mail',
  'DevSoft Baltic',
  'no-reply@devexpress.com',
  'DevExpress Support Team',
  'Test Shared Mailbox',
  'Vacation Requests'
];

const postfixes = ['(DevExpress)', '(DevExpress Support)', '(O365)', '(DevExress Support)', '(DevSoft.PH)'];

function isUser(azureUser: {
  accountEnabled: boolean;
  assignedLicenses?: Array<any>;
  mail?: string;
  id?: string;
  displayName?: string;
  userPrincipalName?: string;
}) {
  const isEnabled =
    azureUser.mail &&
    azureUser.accountEnabled &&
    azureUser.assignedLicenses &&
    azureUser.assignedLicenses.length > 0 &&
    azureUser.id &&
    azureUser.displayName &&
    azureUser.userPrincipalName;

  return isEnabled && !exceptions.includes(azureUser.displayName);
}

const regExpMinus = /-/g;

function prepareUser(azureUser: { id: string; displayName: string; userPrincipalName: string }) {
  const id = azureUser.id.replace(regExpMinus, '').slice(0, 24);
  let name = azureUser.displayName;
  for (const postfix of postfixes) {
    name = name.replace(postfix, '');
  }
  name = name.trim();
  const email = azureUser.userPrincipalName.toLowerCase();

  return {
    id,
    name,
    email
  };
}

export async function importUsers() {
  const graphServiceResponse = await graphService.all('/users');

  const users = graphServiceResponse.data.filter(isUser).map(prepareUser);

  console.log('users');
  console.log(JSON.stringify(users, null, 2));

  return users;
}
