import { MongoClient } from 'mongodb';

import { MONGO_USER, MONGO_PASSWORD, MONGO_DOMAIN, MONGO_DATABASE } from './constants';

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_DOMAIN}/${MONGO_DATABASE}?retryWrites=true&w=majority`;

export function connectToMongoDB(): Promise<MongoClient> {
  return MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}
