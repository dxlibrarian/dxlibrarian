import { MongoClient } from 'mongodb';

import { TEntityId } from '../entity-id';

class Resolver {
  mongoClient: MongoClient;

  constructor(mongoClient: MongoClient) {
    this.mongoClient = mongoClient;
  }
  async read(entityId: TEntityId) {
    const { entityName, documentId } = entityId;
    console.log({ entityName, documentId });
    return {};
  }
}

export const resolver = {
  connect(mongoClient: MongoClient) {
    return new Resolver(mongoClient);
  }
};
