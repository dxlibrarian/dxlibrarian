import ClientCredentials from 'client-credentials';
import GraphService from 'graph-service';

import { entityId } from '../reventex/server';
import { createDomain } from '../domain/createDomain';
import { Event, EntityName } from '../constants';
import { getLog } from '../utils/getLog';

const log = getLog('dxlibrarian:import-users');

import { AZURE_CLIENT_SECRET, AZURE_CLIENT_ID, AZURE_CLIENT_TENANT, Resolver } from '../constants';

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
  const { read, publish, close } = createDomain();

  try {
    log.debug('Import users has been started');
    const [graphServiceResponse, mongoUsers] = await Promise.all([
      graphService.all('/users'),
      read(Resolver.GET_ALL_USERS, {})
    ]);
    log.debug('Mongo and Azure users have been fetched');

    const events: Array<{ type: string; payload?: { [key: string]: any } }> = [];

    for (const azureUser of graphServiceResponse.data.filter(isUser).map(prepareUser)) {
      const mongoUser = mongoUsers.get(azureUser.id);
      if (mongoUser != null) {
        if (azureUser.name !== mongoUser.name || azureUser.email !== mongoUser.email) {
          events.push({
            type: Event.USER_UPDATED,
            payload: {
              ...azureUser,
              id: entityId(EntityName.USER, azureUser.id)
            }
          });
        }
      } else {
        events.push({
          type: Event.USER_CREATED,
          payload: {
            ...azureUser,
            id: entityId(EntityName.USER, azureUser.id)
          }
        });
      }
      mongoUsers.delete(azureUser.id);
    }
    for (const [_, { id, ...other }] of mongoUsers) {
      events.push({
        type: Event.USER_REMOVED,
        payload: {
          ...other,
          id: entityId(EntityName.USER, id)
        }
      });
    }

    log.debug(`Events count: ${events.length}`);

    log.debug('Operation "publish" has been started');
    await publish(events);
    log.debug('Operation "publish" has been finished');
  } finally {
    log.debug('Operation "close" has been started');
    await close();
    log.debug('Operation "close" has been finished');

    log.debug('Import users has been finished');
  }
}
