import { ObjectId, MongoClient, SessionOptions, ClientSession, Collection } from 'mongodb';

import { extractEntityIdsFromEvent } from '../utils/extract-entity-ids-from-event';
import { PRIVATE } from '../constants';

import { SideEffect } from '../side-effect';
import { Projection } from '../projection';
import { Resolver } from '../resolver';
import { TEvent } from '../event';
import { EntityId } from '../entity-id';
import { effectFactory as api } from '../effects/effect-factory';
import { processor } from '../effects/mongo/processor';

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
    if (domain[PRIVATE].eventStoreMetaCollectionName == null) {
      throw new Error('Event store meta is required');
    }
    if (domain[PRIVATE].databaseName == null) {
      throw new Error('Database name is required');
    }
    return method.apply(domain, args);
  };
}

export class Domain {
  [PRIVATE]: {
    projections: Array<Projection>;
    sideEffects: Array<SideEffect>;
    resolvers: Map<string, Resolver>;
    databaseName: string;
    eventStoreCollectionName: string;
    eventStoreMetaCollectionName: string;
    resolverClient: Promise<MongoClient>;
    builderClient: Promise<MongoClient>;
    resolverSession: Promise<ClientSession>;
    builderSession: Promise<ClientSession>;
  };

  constructor() {
    Object.defineProperty(this, PRIVATE, {
      value: {
        projections: [],
        sideEffects: [],
        resolvers: new Map(),
        documentId: ObjectId
      }
    });

    this.publish = checkRequiredFields(this, this.publish);
    this.build = checkRequiredFields(this, this.build);
    this.drop = checkRequiredFields(this, this.drop);
    this.read = checkRequiredFields(this, this.read);
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
  resolvers(resolvers: Array<Resolver>) {
    for (const resolver of resolvers) {
      const {
        [PRIVATE]: { name }
      } = resolver;
      this[PRIVATE].resolvers.set(name, resolver);
    }
    return this;
  }
  eventStore(eventStoreCollectionName: string) {
    this[PRIVATE].eventStoreCollectionName = eventStoreCollectionName;
    this[PRIVATE].eventStoreMetaCollectionName = `${eventStoreCollectionName}-meta`;
    return this;
  }
  database(databaseName: string) {
    this[PRIVATE].databaseName = databaseName;
    return this;
  }
  async build() {
    const {
      builderClient,
      builderSession,
      databaseName,
      eventStoreCollectionName,
      eventStoreMetaCollectionName,
      projections,
      sideEffects
    } = this[PRIVATE];

    const database = await (await builderClient).db(databaseName);
    const session = await builderSession;

    const collectionPromises: Array<Promise<any>> = [];

    collectionPromises.push(
      database.createCollection(eventStoreCollectionName, { session }),
      database.createCollection(eventStoreMetaCollectionName, { session })
    );

    for (const {
      [PRIVATE]: { name }
    } of projections) {
      collectionPromises.push(database.createCollection(name, { session }));
    }

    await Promise.all(collectionPromises);

    const eventStore = database.collection(eventStoreCollectionName);
    const eventStoreMeta = database.collection(eventStoreMetaCollectionName);

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
      ),
      eventStoreMeta.createIndex(
        {
          entityName: 1,
          documentId: 1
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

        const documentIdAsObjectId = new ObjectId(documentId);

        for (let projectionIndex = 0; projectionIndex < countProjections; projectionIndex++) {
          const projection = projections[projectionIndex];
          const eventHandler = projection[PRIVATE].eventHandlers[event.type];

          if (entityName === projection[PRIVATE].name && eventHandler != null) {
            const iterator = eventHandler({
              event,
              documentId,
              api
            });

            for (const effect of iterator) {
              await processor(
                {
                  documentId: documentIdAsObjectId,
                  collection,
                  session
                },
                effect
              );
            }
          }
        }
      }
    }
  }
  async drop(options?: { eventStore?: boolean }) {
    const {
      builderClient,
      builderSession,
      databaseName,
      eventStoreCollectionName,
      eventStoreMetaCollectionName,
      projections,
      sideEffects
    } = this[PRIVATE];

    const database = await (await builderClient).db(databaseName);
    const session = await builderSession;

    const collections: Array<Collection> = [];

    const databasePromises: Array<Promise<any>> = [];

    if (options != null && options.eventStore) {
      const eventStore = database.collection(eventStoreCollectionName);
      const eventStoreMeta = database.collection(eventStoreMetaCollectionName);
      collections.push(eventStore);
      collections.push(eventStoreMeta);
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

    await Promise.all(databasePromises);
  }
  async publish(events: Array<TEvent>) {
    const {
      projections,
      sideEffects,
      builderClient,
      builderSession,
      databaseName,
      eventStoreCollectionName,
      eventStoreMetaCollectionName
    } = this[PRIVATE];

    const countSideEffects = sideEffects.length;
    const countEvents = events.length;
    const databasePromises: Array<Promise<any>> = [];

    const session = await builderSession;

    await session.startTransaction();
    const database = await (await builderClient).db(databaseName);

    const eventStore = database.collection(eventStoreCollectionName);
    const eventStoreMeta = database.collection(eventStoreMetaCollectionName);

    const entityIdsByEvent = new WeakMap<TEvent, Array<EntityId>>();

    try {
      for (let eventIndex = 0; eventIndex < countEvents; eventIndex++) {
        const event = events[eventIndex];
        const entityIds = extractEntityIdsFromEvent(event);
        if (entityIds.length === 0) {
          throw new Error(`Incorrect event: ${JSON.stringify(event)}`);
        }

        entityIdsByEvent.set(event, entityIds);

        const countEntityIds = entityIds.length;

        const entityNameIndexes = new Map<string, number>();

        for (let entityIdIndex = 0; entityIdIndex < countEntityIds; entityIdIndex++) {
          const { entityName, documentId } = entityIds[entityIdIndex];

          const documentIdAsObjectId = new ObjectId(documentId);

          entityNameIndexes.set(entityName, entityIdIndex);

          const { documentVersion: originalDocumentVersion } =
            (await eventStoreMeta.findOne(
              {
                entityName,
                documentId: documentIdAsObjectId
              },
              {
                projection: { documentVersion: 1 },
                session
              }
            )) || {};
          let documentVersion = originalDocumentVersion;

          documentVersion = ~~documentVersion + 1;
          entityIds[entityIdIndex].documentVersion = documentVersion;

          await eventStoreMeta.updateOne(
            {
              entityName,
              documentId: documentIdAsObjectId
            },
            { $set: { documentVersion } },
            {
              session,
              upsert: true
            }
          );
        }

        const eventId = new ObjectId();
        const eventStoreItem = {
          $currentDate: {
            timestamp: true
          },
          $setOnInsert: {
            ...event,
            entityId: entityIds
          }
        };
        if (event.timestamp != null) {
          event.timestamp = new Date(event.timestamp);
          delete eventStoreItem.$currentDate;
        }
        const { upsertedCount, modifiedCount } = await eventStore.updateOne({ _id: eventId }, eventStoreItem, {
          session,
          upsert: true
        });
        if (upsertedCount !== 1 || modifiedCount !== 0) {
          const concurrencyError: Error & { code?: number } = new Error('Concurrency error');
          concurrencyError.code = 412;
          throw concurrencyError;
        }
        // @ts-ignore
        event.timestamp = (
          await eventStore.findOne(
            { _id: eventId },
            {
              session,
              projection: {
                _id: 0,
                timestamp: 1
              }
            }
          )
        ).timestamp;

        for (let entityIdIndex = 0; entityIdIndex < countEntityIds; entityIdIndex++) {
          const { entityName, documentId } = entityIds[entityIdIndex];

          const documentIdAsObjectId = new ObjectId(documentId);

          const collection = database.collection(entityName);

          const projection = projections.find(({ [PRIVATE]: { name } }) => name === entityName);
          if (projection != null) {
            const eventHandler = projection[PRIVATE].eventHandlers[event.type];

            if (entityName === projection[PRIVATE].name && eventHandler != null) {
              const iterator = eventHandler({
                event,
                documentId,
                api
              });

              for (const effect of iterator) {
                await processor(
                  {
                    documentId: documentIdAsObjectId,
                    collection,
                    session
                  },
                  effect
                );
              }
            }
          }
        }
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
              await eventHandler({
                event,
                documentId,
                api
              });
            }
          }
        }
      }

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
  async read(resolverName: string, resolverArgs: { [key: string]: any }) {
    const { resolvers, builderClient, builderSession, databaseName } = this[PRIVATE];

    const resolver = resolvers.get(resolverName);
    if (resolver == null) {
      throw new Error(`The resolver "${resolverName}" is not found`);
    }
    const session = await builderSession;
    const database = await (await builderClient).db(databaseName);

    return resolver.read({ database, session }, resolverArgs);
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
  resolvers(resolvers: Array<Resolver>) {
    const instance = new Domain();
    return instance.resolvers(resolvers);
  }
  // close() {
  //   const instance = new Domain();
  //   return instance.close();
  // }
};
