import { ObjectId, MongoClient, SessionOptions, ClientSession, Collection } from 'mongodb';

import { extractEntityIdsFromEvent } from '../utils/extract-entity-ids-from-event';
import { PRIVATE } from '../constants';
import { MutationMongoApi } from '../mutation-api';
import { SideEffect } from '../side-effect';
import { Projection } from '../projection';
import { TEvent } from '../event';

const sessionOptions: SessionOptions = {
  causalConsistency: true,
  defaultTransactionOptions: {
    readConcern: { level: 'snapshot' },
    writeConcern: { w: 'majority', wtimeout: 30000, j: true }
  }
};

function checkRequiredFields<A extends Array<any>, B extends any>(domain: Domain, method: (...args: A) => B) {
  return function wrappedMethod(...args: A): B {
    if (domain[PRIVATE].eventStoreCollectionName == null) {
      throw new Error('Event store is required');
    }
    if (domain[PRIVATE].databaseName == null) {
      throw new Error('Database name is required');
    }
    return method.apply(domain, args);
  };
}

class Domain {
  [PRIVATE]: {
    api: MutationMongoApi;
    projections: Array<Projection>;
    sideEffects: Array<SideEffect>;
    databaseName: string;
    eventStoreCollectionName: string;
    resolverClient: Promise<MongoClient>;
    builderClient: Promise<MongoClient>;
    resolverSession: Promise<ClientSession>;
    builderSession: Promise<ClientSession>;
    [key: string]: any;
  };

  constructor() {
    Object.defineProperty(this, PRIVATE, {
      value: {
        api: new MutationMongoApi(),
        projections: [],
        sideEffects: [],
        documentId: ObjectId
      }
    });

    this.publish = checkRequiredFields(this, this.publish);
    this.build = checkRequiredFields(this, this.build);
    this.drop = checkRequiredFields(this, this.drop);
    this.close = checkRequiredFields(this, this.close);
  }
  connect(builderClient: Promise<any>, resolverClient?: Promise<any>) {
    if (builderClient == null) {
      throw new Error('Argument "client" is required');
    }
    this[PRIVATE].builderClient = Promise.resolve(builderClient);
    this[PRIVATE].resolverClient =
      resolverClient == null ? this[PRIVATE].builderClient : Promise.resolve(resolverClient);

    this[PRIVATE].builderSession = this[PRIVATE].builderClient.then((client: MongoClient) =>
      client.startSession(sessionOptions)
    );
    if (this[PRIVATE].builderClient !== this[PRIVATE].resolverClient) {
      this[PRIVATE].resolverSession = this[PRIVATE].resolverClient.then((client: MongoClient) =>
        client.startSession(sessionOptions)
      );
    }

    return this;
  }
  projections(projections: Array<Projection>) {
    this[PRIVATE].projections.push(...projections);
    return this;
  }
  sideEffects(sideEffects: Array<SideEffect>) {
    this[PRIVATE].sideEffects.push(...sideEffects);
    return this;
  }
  eventStore(eventStoreCollectionName: string) {
    this[PRIVATE].eventStoreCollectionName = eventStoreCollectionName;
    return this;
  }
  database(databaseName: string) {
    this[PRIVATE].databaseName = databaseName;
    return this;
  }
  async build() {
    const {
      api,
      builderClient,
      builderSession,
      databaseName,
      eventStoreCollectionName,
      projections,
      sideEffects
    } = this[PRIVATE];

    const database = await (await builderClient).db(databaseName);
    const session = await builderSession;

    const collectionPromises: Array<Promise<any>> = [];

    collectionPromises.push(database.createCollection(eventStoreCollectionName, { session }));

    for (const {
      [PRIVATE]: { name }
    } of projections) {
      collectionPromises.push(database.createCollection(name, { session }));
    }

    await Promise.all(collectionPromises);

    const eventStore = database.collection(eventStoreCollectionName);

    const indexPromises: Array<Promise<any>> = [];

    indexPromises.push(
      eventStore.createIndex(
        {
          'entityId.documentId': 1,
          'entityId.entityName': 1
        },
        { session }
      ),
      eventStore.createIndex(
        {
          'entityId.documentVersion': 1
        },
        { session }
      )
    );

    for (const {
      [PRIVATE]: { name, indexes }
    } of projections) {
      const collection = database.collection(name);
      for (const [index, indexOptions] of indexes) {
        indexPromises.push(collection.createIndex(index, { ...indexOptions, session }));
      }
    }

    for (const {
      [PRIVATE]: { name, indexes }
    } of sideEffects) {
      const collection = database.collection(name);
      for (const [index, indexOptions] of indexes) {
        indexPromises.push(collection.createIndex(index, { ...indexOptions, session }));
      }
    }

    await Promise.all(indexPromises);

    const countProjections = projections.length;

    const cursor = eventStore.find({}, { session, projection: { _id: 0 } }).sort({ 'entityId.documentVersion': 1 });

    while (await cursor.hasNext()) {
      const item = await cursor.next();

      const { entityId: entityIds, ...event } = item;

      const countEntityIds = entityIds.length;

      for (let entityIdIndex = 0; entityIdIndex < countEntityIds; entityIdIndex++) {
        const { entityName, documentId } = entityIds[entityIdIndex];

        const collection = database.collection(entityName);

        api[PRIVATE].collection = collection;
        api[PRIVATE].documentId = new ObjectId(documentId);
        api[PRIVATE].session = session;
        for (let projectionIndex = 0; projectionIndex < countProjections; projectionIndex++) {
          const projection = projections[projectionIndex];
          const eventHandler = projection[PRIVATE].eventHandlers[event.type];

          if (entityName === projection[PRIVATE].name && eventHandler != null) {
            eventHandler({
              event,
              documentId,
              api
            });
          }
        }
      }
    }
  }
  async drop(options?: { eventStore?: boolean }) {
    const { builderClient, builderSession, databaseName, eventStoreCollectionName, projections, sideEffects } = this[
      PRIVATE
    ];

    const database = await (await builderClient).db(databaseName);
    const session = await builderSession;

    const collections: Array<Collection> = [];

    const databasePromises: Array<Promise<any>> = [];

    if (options != null && options.eventStore) {
      const eventStore = database.collection(eventStoreCollectionName);
      collections.push(eventStore);
    }

    for (const {
      [PRIVATE]: { name }
    } of projections) {
      collections.push(database.collection(name));
    }

    for (const {
      [PRIVATE]: { name }
    } of sideEffects) {
      collections.push(database.collection(name));
    }

    for (const collection of collections) {
      databasePromises.push(
        collection.drop({ session }).catch(function(error: Error & { code?: number }) {
          if (error.code != 26) {
            throw error;
          }
        })
      );
    }
  }
  async publish(events: Array<TEvent>) {
    const {
      projections,
      sideEffects,
      api,
      builderClient,
      builderSession,
      databaseName,
      eventStoreCollectionName
    } = this[PRIVATE];

    const countProjections = projections.length;
    const countSideEffects = sideEffects.length;
    const countEvents = events.length;
    const databasePromises: Array<Promise<any>> = [];
    const otherPromises = [];

    await (await builderSession).startTransaction();
    const database = await (await builderClient).db(databaseName);

    const eventStore = database.collection(eventStoreCollectionName);

    const entityIdsByEvent = new WeakMap();

    const session = await builderSession;

    try {
      for (let eventIndex = 0; eventIndex < countEvents; eventIndex++) {
        const event = events[eventIndex];
        const entityIds = extractEntityIdsFromEvent(event);

        entityIdsByEvent.set(event, entityIds);
        const countEntityIds = entityIds.length;

        for (let entityIdIndex = 0; entityIdIndex < countEntityIds; entityIdIndex++) {
          const { entityName, documentId } = entityIds[entityIdIndex];

          const collection = database.collection(entityName);

          api[PRIVATE].collection = collection;
          api[PRIVATE].documentId = new ObjectId(documentId);
          api[PRIVATE].session = session;
          for (let projectionIndex = 0; projectionIndex < countProjections; projectionIndex++) {
            const projection = projections[projectionIndex];
            const eventHandler = projection[PRIVATE].eventHandlers[event.type];

            if (entityName === projection[PRIVATE].name && eventHandler != null) {
              eventHandler({
                event,
                documentId,
                api
              });
            }
          }

          const { _version } = await collection.findOne(
            {
              _id: new ObjectId(documentId)
            },
            {
              projection: { _version: 1 },
              session
            }
          );
          entityIds[entityIdIndex].documentVersion = _version;
        }

        await eventStore.insertOne(
          {
            entityId: entityIds,
            ...event
          },
          { session: session }
        );
      }

      await Promise.all(databasePromises);

      for (let eventIndex = 0; eventIndex < countEvents; eventIndex++) {
        const event = events[eventIndex];
        const entityIds = entityIdsByEvent.get(event);
        const countEntityIds = entityIds.length;
        for (let entityIdIndex = 0; entityIdIndex < countEntityIds; entityIdIndex++) {
          const { entityName, documentId } = entityIds[entityIdIndex];

          for (let sideEffectIndex = 0; sideEffectIndex < countSideEffects; sideEffectIndex++) {
            const projection = sideEffects[sideEffectIndex];
            const eventHandler = projection[PRIVATE].eventHandlers[event.type];

            if (entityName === projection[PRIVATE].name && eventHandler != null) {
              otherPromises.push(
                eventHandler({
                  event,
                  documentId,
                  api
                })
              );
            }
          }
        }
      }

      await Promise.all(otherPromises);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }
  async close() {
    const { builderClient, resolverClient } = this[PRIVATE];
    await (await builderClient).close();
    if (builderClient !== resolverClient) {
      await (await resolverClient).close();
    }
  }
}

export const domain = {
  connect(builderClient: Promise<MongoClient>, resolverClient?: Promise<MongoClient>) {
    const instance = new Domain();
    return instance.connect(builderClient, resolverClient);
  },
  projections(projections: Array<Projection>) {
    const instance = new Domain();
    return instance.projections(projections);
  },
  sideEffects(projections: Array<SideEffect>) {
    const instance = new Domain();
    return instance.sideEffects(projections);
  },
  eventStore(eventStoreCollectionName: string) {
    const instance = new Domain();
    return instance.eventStore(eventStoreCollectionName);
  },
  close() {
    const instance = new Domain();
    return instance.close();
  }
};
