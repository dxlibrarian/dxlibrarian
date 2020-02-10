import { MongoClient } from 'mongodb';

import { domain } from '../reventex/server';

import users from './projections/users';
import books from './projections/books';
import getAllUsers from './resolvers/getAllUsers';
import getAllUsersGroupByEmail from './resolvers/getAllUsersGroupByEmail';
import getUser from './resolvers/getUser';
import searchBooks from './resolvers/searchBooks';
import getBookInfoById from './resolvers/getBookInfoById';

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
    .projections([users, books])
    .resolvers([getAllUsers, getAllUsersGroupByEmail, getUser, searchBooks, getBookInfoById]);
