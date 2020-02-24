import fs from 'fs';
import util from 'util';
import path from 'path';

import { entityId, EntityId } from '../reventex/server';

import { createDomain } from '../domain/createDomain';
import { getLog } from '../utils/getLog';

import { Resolver, Location, EntityName, Event, DXLibrarianUser } from '../constants';

import { process as importUsers } from './importUsers';

const log = getLog('dxlibrarian:import-old-events');

const SKIP = Symbol();

function getOldEvents(userByEmail: Map<string, DXLibrarianUser>) {
  const mongoEvents = fs.readFileSync(path.join(__dirname, 'dxlibrarian-events-24.01.2020.txt')).toString('utf8');

  const events: Array<any> = JSON.parse(
    '[' +
      mongoEvents
        .trim()
        .replace(/ObjectId\((.*?)\)/g, '$1')
        .replace(/\/\*\s+\d+\s+\*\//gi, '')
        .replace(/\}\s+\{/gi, '},{') +
      ']'
  )
    .map((event: any) => {
      delete event._id;
      return event;
    })
    .filter((event: any) => event.type !== 'UPDATE_SETTINGS');

  const aggregateIds = new Set<string>(events.map(({ aggregateId }) => aggregateId));
  const aggregateIdToEntityIdMap: { [key: string]: EntityId } = {};
  for (const aggregateId of aggregateIds) {
    aggregateIdToEntityIdMap[aggregateId] = entityId(EntityName.BOOK);
  }

  const admins = [
    {
      userId: '4e204bb28bff4279bebcdd6a',
      name: 'Anton Zhukov',
      email: 'anton.zhukov@devexpress.com'
    },
    {
      userId: 'a370b1df2ecd4f94afa84b20',
      name: 'Ekaterina Kablukova',
      email: 'ekaterina.kablukova@devexpress.com'
    },
    {
      userId: '7548ccde348f47c09b32cccf',
      name: 'Marianna Evseeva',
      email: 'marianna@devexpress.com'
    }
  ];

  for (const event of events) {
    if (event.type !== 'CREATE_BOOK') {
      continue;
    }
    event.payload.bookId = aggregateIdToEntityIdMap[event.aggregateId];
    let adminUserId = admins[0].userId;
    for (const admin of admins) {
      if (admin.email === event.payload.user) {
        adminUserId = admin.userId;
        break;
      }
    }
    delete event.payload.user;
    event.payload.userId = entityId(EntityName.USER, adminUserId);

    if (event.payload.ISBN === '') {
      delete event.payload.ISBN;
    }

    if (event.payload.tags == null) {
      event.payload.tags = [];
    }

    if (event.payload.img != null && event.payload.img.startsWith('/images')) {
      delete event.payload.img;
    }

    delete event.aggregateId;
    delete event.aggregateName;
    event.type = 'BOOK_CREATED';
    event.timestamp = new Date(event.timestamp);
    switch (event.payload.location) {
      case 'spb': {
        event.payload.location = Location.SPB;
        break;
      }
      case 'kaluga': {
        event.payload.location = Location.KALUGA;
        break;
      }
      case 'unknown':
      case 'tula':
      case undefined: {
        event.payload.location = Location.TULA;
        break;
      }
      default: {
        throw new Error('location = ' + event.payload.location);
      }
    }
  }

  for (const event of events) {
    if (event.type === 'BOOK_CREATED') {
      continue;
    }

    const userId = userByEmail.get(event.payload.user)?.userId;
    //console.log(userId, event.payload.user, userByEmail.get(event.payload.user))
    if (userId == null) {
      event[SKIP] = true;
      continue;
    }
    event.payload.userId = entityId(EntityName.USER, userId);

    event.payload.bookId = aggregateIdToEntityIdMap[event.aggregateId];

    event.timestamp = new Date(event.timestamp);

    delete event.aggregateId;
    delete event.aggregateName;

    switch (event.type) {
      case 'TAKE_BOOK': {
        event.type = Event.BOOK_TAKEN_BY_USER;
        break;
      }
      case 'LIKE_BOOK': {
        event.type = Event.BOOK_LIKED_BY_USER;
        break;
      }
      case 'DISLIKE_BOOK': {
        event.type = Event.BOOK_DISLIKED_BY_USER;
        break;
      }
      case 'RETURN_BOOK': {
        event.type = Event.BOOK_RETURNED_BY_USER;
        break;
      }
      case 'TRACK_BOOK': {
        event.type = Event.BOOK_TRACKED_BY_USER;
        break;
      }
      case 'UNTRACK_BOOK': {
        event.type = Event.BOOK_UNTRACKED_BY_USER;
        break;
      }
      default: {
        throw new Error(`Unknown event type = ${event.type}`);
      }
    }

    console.log(util.inspect(event));
  }

  // console.log(...events.map(event => util.inspect(event)));

  return events.filter(event => !event[SKIP]);
}

export async function importOldEvents() {
  const domain = createDomain();

  const { publish, read, close, drop, build } = domain;

  try {
    log.debug('Executor "importOldEvents" has been started');

    log.debug('Operation "drop" has been started');
    await drop({ eventStore: true });
    log.debug('Operation "drop" has been finished');

    log.debug('Operation "build" has been started');
    await build();
    log.debug('Operation "build" has been finished');

    log.debug('Operation "importUsers" has been started');
    await publish(await importUsers(domain));
    log.debug('Operation "importUsers" has been finished');

    log.debug('Operation "publish" has been started');
    const userByEmail = await read(Resolver.GET_ALL_USERS_GROUP_BY_EMAIL, {});
    await publish(getOldEvents(userByEmail));
    log.debug('Operation "publish" has been finished');

    log.debug('Executor "importOldEvents" has been finished');
  } catch (error) {
    log.debug('Executor "importOldEvents" has been failed');
    throw error;
  } finally {
    log.debug('Operation "close" has been started');
    await close();
    log.debug('Operation "close" has been finished');
  }
}
