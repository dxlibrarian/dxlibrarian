import ClientCredentials from 'client-credentials';
import GraphService from 'graph-service';

import { entityId, Domain } from '../reventex/server';

import { isUser } from '../auth/isUser';
import { prepareUser } from '../auth/prepareUser';
import { createDomain } from '../domain/createDomain';
import { Event, EntityName } from '../constants';
import { getLog } from '../utils/getLog';

import { AzureUser, DXLibrarianUser } from '../constants';

const log = getLog('dxlibrarian:import-users');

import { AZURE_CLIENT_SECRET, AZURE_CLIENT_ID, AZURE_CLIENT_TENANT, Resolver } from '../constants';

const azureCredentials = new ClientCredentials(AZURE_CLIENT_TENANT, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET);

const graphService = new GraphService(azureCredentials, 'beta');

export async function process(domain: Domain) {
  const { read } = domain;

  const [graphServiceResponse, resolverResult] = await Promise.all([
    graphService.all('/users'),
    read(Resolver.GET_ALL_USERS_GROUP_BY_USER_ID, {})
  ]);
  const azureUsers: Array<AzureUser> = graphServiceResponse.data;
  const mongoUsers: Map<string, DXLibrarianUser> = resolverResult;

  log.debug('Mongo and Azure users have been fetched');

  const events: Array<{ type: string; payload?: { [key: string]: any } }> = [];

  for (const user of azureUsers.filter(isUser).map(prepareUser)) {
    const mongoUser = mongoUsers.get(user.userId);
    if (mongoUser != null) {
      if (user.name !== mongoUser.name || user.email !== mongoUser.email) {
        events.push({
          type: Event.USER_UPDATED,
          payload: {
            ...user,
            userId: entityId(EntityName.USER, user.userId)
          }
        });
      }
    } else {
      events.push({
        type: Event.USER_CREATED,
        payload: {
          ...user,
          userId: entityId(EntityName.USER, user.userId)
        }
      });
    }
    mongoUsers.delete(user.userId);
  }
  for (const [, { userId, ...other }] of mongoUsers) {
    events.push({
      type: Event.USER_REMOVED,
      payload: {
        ...other,
        userId: entityId(EntityName.USER, userId)
      }
    });
  }

  return events;
}

export async function importUsers() {
  const domain = createDomain();

  const { publish, close } = domain;

  try {
    log.debug('Executor "importUsers" has been started');
    const events = await process(domain);

    log.debug(`Events count: ${events.length}`);
    log.debug(`Events:`, events);

    log.debug('Operation "publish" has been started');
    await publish(events);
    log.debug('Operation "publish" has been finished');

    log.debug('Executor "importUsers" has been finished');
  } catch (error) {
    log.debug('Executor "importUsers" has been failed');
    throw error;
  } finally {
    log.debug('Operation "close" has been started');
    await close();
    log.debug('Operation "close" has been finished');
  }
}
