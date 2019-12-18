import { MongoClient } from 'mongodb';

import { domain } from '../reventex/server';

import users from './projections/users';
import getAllUsers from './resolvers/getAllUsers';

import {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_DOMAIN,
  MONGO_DATABASE,
  DATABASE_NAME,
  EVENT_STORE_COLLECTION_NAME
} from '../constants';

const mongoConnectionUrl = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_DOMAIN}/${MONGO_DATABASE}?retryWrites=true&w=majority`;

export const createDomain = () =>
  domain
    .connect(
      MongoClient.connect(mongoConnectionUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    )
    .database(DATABASE_NAME)
    .eventStore(EVENT_STORE_COLLECTION_NAME)
    .projections([users])
    .resolvers([getAllUsers]);
