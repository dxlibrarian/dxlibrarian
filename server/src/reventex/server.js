'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var mongodb = require('mongodb');

const MACHINE_ID = Math.floor(Math.random() * 0xffffff);
let index = Math.floor(Math.random() * 0xffffff);
const pid =
  (typeof process === 'undefined' || typeof process.pid !== 'number'
    ? Math.floor(Math.random() * 100000)
    : process.pid) % 0xffff;

function next() {
  return (index = (index + 1) % 0xffffff);
}

function hex(length, n) {
  const h = n.toString(16);
  return h.length === length ? h : '00000000'.substring(h.length, length) + h;
}

function createDocumentId() {
  const time = Math.floor(Date.now() / 1000) % 0xffffffff;
  return hex(8, time) + hex(6, MACHINE_ID) + hex(4, pid) + hex(6, next());
}

const validateRegExp = /^[0-9A-F]{24}$/i;
class EntityId {
  constructor(entityName, documentId) {
    if (entityName == null || entityName.constructor !== String) {
      throw new Error(`Argument "entityName" must be a string`);
    }

    if (documentId == null || documentId.constructor !== String) {
      throw new Error(`Argument "documentId" must be a string"`);
    }

    if (!validateRegExp.test(documentId)) {
      throw new Error(`Incorrect argument "documentId" = ${JSON.stringify(documentId)}. RegExp = ${validateRegExp}`);
    }

    this.entityName = entityName;
    this.documentId = documentId;
  }
}
const entityId = (entityName, documentId = createDocumentId()) => new EntityId(entityName, documentId);

const recursive = (entityIds, value, dictionary, dictionaryKey) => {
  if (value instanceof EntityId) {
    if (
      !entityIds.find(function(entityId) {
        return entityId.entityName === value.entityName && entityId.documentId === value.documentId;
      })
    ) {
      entityIds.push(value);
      dictionary[dictionaryKey] = value.documentId;
    }
  } else if (Array.isArray(value)) {
    const size = value.length;

    for (let index = 0; index < size; index++) {
      recursive(entityIds, value[index], value, index);
    }
  } else if (value === Object(value)) {
    for (let key in value) {
      if (!value.hasOwnProperty(key)) {
        continue;
      }

      recursive(entityIds, value[key], value, key);
    }
  }
};

function extractEntityIdsFromEvent(event) {
  const entityIds = [];
  recursive(
    entityIds,
    event,
    {
      event
    },
    'event'
  );
  return entityIds;
}

const PRIVATE = '@@REVENTEXT';

const prepareKey = key => {
  if (Array.isArray(key)) {
    const keyLength = key.length;

    for (let index = 0; index < keyLength; index++) {
      if (String(key[index]).indexOf('.') !== -1) {
        throw new TypeError();
      }
    }

    return key;
  } else {
    if (String(key).indexOf('.') !== -1) {
      throw new TypeError();
    }

    return [key];
  }
};

const normalizeArgsKVS = args => {
  switch (args.length) {
    case 1: {
      const key = [];
      const value = args[0];
      return [key, value, undefined];
    }

    case 2:
    case 3: {
      const key = args[0];
      const value = args[1];
      const sliceSize = args[2];
      return [prepareKey(key), value, sliceSize];
    }

    default: {
      throw new TypeError();
    }
  }
};
const normalizeArgsKK = args => {
  switch (args.length) {
    case 2: {
      const key = args[0];
      const newKey = args[1];
      return [prepareKey(key), prepareKey(newKey)];
    }

    default: {
      throw new TypeError();
    }
  }
};
const normalizeArgsKV = args => {
  switch (args.length) {
    case 1: {
      const key = [];
      const value = args[0];
      return [key, value];
    }

    case 2: {
      const key = args[0];
      const value = args[1];
      return [prepareKey(key), value];
    }

    default: {
      throw new TypeError();
    }
  }
};
const normalizeArgsK = args => {
  switch (args.length) {
    case 0: {
      const key = [];
      return [key];
    }

    case 1: {
      const key = args[0];
      return [prepareKey(key)];
    }

    default: {
      throw new TypeError();
    }
  }
};

let EffectType;

(function(EffectType) {
  EffectType['SET'] = 'SET';
  EffectType['REMOVE'] = 'REMOVE';
  EffectType['MERGE'] = 'MERGE';
  EffectType['SET_MAXIMUM'] = 'SET_MAXIMUM';
  EffectType['SET_MINIMUM'] = 'SET_MINIMUM';
  EffectType['INCREMENT'] = 'INCREMENT';
  EffectType['DECREMENT'] = 'DECREMENT';
  EffectType['MULTIPLY'] = 'MULTIPLY';
  EffectType['DIVIDE'] = 'DIVIDE';
  EffectType['RENAME'] = 'RENAME';
  EffectType['ADD_TO_SET'] = 'ADD_TO_SET';
  EffectType['PUSH_FRONT'] = 'PUSH_FRONT';
  EffectType['POP_FRONT'] = 'POP_FRONT';
  EffectType['PUSH_BACK'] = 'PUSH_BACK';
  EffectType['POP_BACK'] = 'POP_BACK';
  EffectType['PULL_EQ'] = 'PULL_EQ';
  EffectType['PULL_GT'] = 'PULL_GT';
  EffectType['PULL_GTE'] = 'PULL_GTE';
  EffectType['PULL_LT'] = 'PULL_LT';
  EffectType['PULL_LTE'] = 'PULL_LTE';
  EffectType['PULL_NE'] = 'PULL_NE';
  EffectType['PULL_IN'] = 'PULL_IN';
  EffectType['PULL_NIN'] = 'PULL_NIN';
  EffectType['GET'] = 'GET';
})(EffectType || (EffectType = {}));

function set(...args) {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.SET
  };
}

function remove(...args) {
  const [key] = normalizeArgsK(args);
  return {
    key,
    value: undefined,
    type: EffectType.REMOVE
  };
}

function merge(...args) {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.MERGE
  };
}

function setMaximum(...args) {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.SET_MAXIMUM
  };
}

function setMinimum(...args) {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.SET_MINIMUM
  };
}

function increment(...args) {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.INCREMENT
  };
}

function decrement(...args) {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.DECREMENT
  };
}

function multiply(...args) {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.MULTIPLY
  };
}

function divide(...args) {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.DIVIDE
  };
}

function rename(...args) {
  const [key, newKey] = normalizeArgsKK(args);
  return {
    key,
    value: newKey,
    type: EffectType.RENAME
  };
}

function addToSet(...args) {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.ADD_TO_SET
  };
}

function pushFront(...args) {
  const [key, value, sliceSize] = normalizeArgsKVS(args);
  return {
    key,
    value,
    sliceSize,
    type: EffectType.PUSH_FRONT
  };
}

function popFront(...args) {
  const [key] = normalizeArgsK(args);
  return {
    key,
    value: undefined,
    type: EffectType.POP_FRONT
  };
}

function pushBack(...args) {
  const [key, value, sliceSize] = normalizeArgsKVS(args);
  return {
    key,
    value,
    sliceSize,
    type: EffectType.PUSH_BACK
  };
}

function popBack(...args) {
  const [key] = normalizeArgsK(args);
  return {
    key,
    value: undefined,
    type: EffectType.POP_BACK
  };
}

function pullEQ(...args) {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.PULL_EQ
  };
}

function pullGT(...args) {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.PULL_GT
  };
}

function pullGTE(...args) {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.PULL_GTE
  };
}

function pullLT(...args) {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.PULL_LT
  };
}

function pullLTE(...args) {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.PULL_LTE
  };
}

function pullNE(...args) {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.PULL_NE
  };
}

function pullIN(...args) {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.PULL_IN
  };
}

function pullNIN(...args) {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.PULL_NIN
  };
}

function get(...args) {
  const [key] = normalizeArgsK(args);
  return {
    key,
    value: undefined,
    type: EffectType.GET
  };
}

const effectFactory = {
  set,
  remove,
  merge,
  setMaximum,
  setMinimum,
  increment,
  decrement,
  multiply,
  divide,
  rename,
  addToSet,
  pushFront,
  popFront,
  pushBack,
  popBack,
  pullEQ,
  pullGT,
  pullGTE,
  pullLT,
  pullLTE,
  pullNE,
  pullIN,
  pullNIN,
  get
};

async function processor(context, effect) {
  const { session, collection, documentId } = context;
  const { type, key, value, sliceSize } = effect;

  switch (type) {
    case EffectType.SET: {
      if (key.length === 0) {
        await collection.replaceOne(
          {
            _id: documentId
          },
          { ...value },
          {
            session,
            upsert: true
          }
        );
      } else {
        await collection.updateOne(
          {
            _id: documentId
          },
          {
            $set: {
              [key.join('.')]: value
            }
          },
          {
            session,
            upsert: true
          }
        );
      }

      break;
    }

    case EffectType.REMOVE: {
      if (key.length === 0) {
        await collection.deleteOne(
          {
            _id: documentId
          },
          {
            session
          }
        );
      } else {
        await collection.updateOne(
          {
            _id: documentId
          },
          {
            $unset: {
              [key.join('.')]: ''
            }
          },
          {
            session,
            upsert: true
          }
        );
      }

      break;
    }

    case EffectType.MERGE: {
      const $set = {};

      for (let kv in value) {
        if (!value.hasOwnProperty(kv)) {
          continue;
        }

        $set[[...key, kv].join('.')] = value[kv];
      }

      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $set
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.SET_MAXIMUM: {
      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $max: {
            [key.join('.')]: value
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.SET_MINIMUM: {
      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $min: {
            [key.join('.')]: value
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.INCREMENT: {
      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $inc: {
            [key.join('.')]: value
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.DECREMENT: {
      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $inc: {
            [key.join('.')]: -value
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.MULTIPLY: {
      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $mul: {
            [key.join('.')]: value
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.DIVIDE: {
      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $mul: {
            [key.join('.')]: 1 / value
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.RENAME: {
      const newKey = value;
      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $rename: {
            [key.join('.')]: [].concat(newKey).join('.')
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.ADD_TO_SET: {
      const items = [].concat(value);
      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $addToSet: {
            [key.join('.')]: {
              $each: items
            }
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.PUSH_FRONT: {
      const items = [].concat(value);
      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $push: {
            [key.join('.')]: {
              $each: items,
              $position: 0
            }
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.POP_FRONT: {
      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $pop: {
            [key.join('.')]: -1
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.PUSH_BACK: {
      const items = [].concat(value);
      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $push: {
            [key.join('.')]: {
              $each: items
            }
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.POP_BACK: {
      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $pop: {
            [key.join('.')]: 1
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.PULL_IN: {
      const items = [].concat(value);
      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $pull: {
            [key.join('.')]: {
              $in: items
            }
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.PULL_NIN: {
      const items = [].concat(value);
      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $pull: {
            [key.join('.')]: {
              $nin: items
            }
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.PULL_EQ: {
      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $pull: {
            [key.join('.')]: {
              $in: [value]
            }
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.PULL_GT: {
      if (Object(value) === value) {
        throw new TypeError();
      }

      if (Array.isArray(value)) {
        throw new TypeError();
      }

      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $pull: {
            [key.join('.')]: {
              $gt: value
            }
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.PULL_GTE: {
      if (Object(value) === value) {
        throw new TypeError();
      }

      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $pull: {
            [key.join('.')]: {
              $gte: value
            }
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.PULL_LT: {
      if (Object(value) === value) {
        throw new TypeError();
      }

      if (Array.isArray(value)) {
        throw new TypeError();
      }

      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $pull: {
            [key.join('.')]: {
              $lt: value
            }
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.PULL_LTE: {
      if (Object(value) === value) {
        throw new TypeError();
      }

      if (Array.isArray(value)) {
        throw new TypeError();
      }

      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $pull: {
            [key.join('.')]: {
              $lte: value
            }
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.PULL_NE: {
      await collection.updateOne(
        {
          _id: documentId
        },
        {
          $pull: {
            [key.join('.')]: {
              $ne: value
            }
          }
        },
        {
          session,
          upsert: true
        }
      );
      break;
    }

    case EffectType.GET: {
      const keyLength = key.length;
      const projection =
        keyLength === 0
          ? {
              _id: 0,
              _version: 0
            }
          : {
              [key.join('.')]: 1,
              _id: 0
            };
      const result = await collection.findOne(
        {
          _id: documentId
        },
        {
          projection,
          session
        }
      );

      if (keyLength === 0) {
        return result;
      }

      let pointer = result;

      for (let index = 0; index < keyLength; index++) {
        if (pointer == null) {
          return undefined;
        }

        pointer = pointer[key[index]];
      }

      return pointer;
    }
  }
}

const sessionOptions = {
  causalConsistency: true,
  defaultTransactionOptions: {
    readConcern: {
      level: 'snapshot'
    },
    writeConcern: {
      w: 'majority',
      wtimeout: 30000,
      j: true
    }
  }
};

function checkRequiredFields(domain, method) {
  return function wrappedMethod(...args) {
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

class Domain {
  constructor() {
    Object.defineProperty(this, PRIVATE, {
      value: {
        projections: [],
        sideEffects: [],
        resolvers: new Map(),
        documentId: mongodb.ObjectId
      }
    });
    this.publish = checkRequiredFields(this, this.publish);
    this.build = checkRequiredFields(this, this.build);
    this.drop = checkRequiredFields(this, this.drop);
    this.read = checkRequiredFields(this, this.read);
    this.close = checkRequiredFields(this, this.close);
  }

  connect(builderClient, resolverClient) {
    if (builderClient == null) {
      throw new Error('Argument "client" is required');
    }

    this[PRIVATE].builderClient = Promise.resolve(builderClient);
    this[PRIVATE].resolverClient =
      resolverClient == null ? this[PRIVATE].builderClient : Promise.resolve(resolverClient);
    this[PRIVATE].builderSession = this[PRIVATE].builderClient.then(client => client.startSession(sessionOptions));

    if (this[PRIVATE].builderClient !== this[PRIVATE].resolverClient) {
      this[PRIVATE].resolverSession = this[PRIVATE].resolverClient.then(client => client.startSession(sessionOptions));
    }

    return this;
  }

  projections(projections) {
    this[PRIVATE].projections.push(...projections);
    return this;
  }

  sideEffects(sideEffects) {
    this[PRIVATE].sideEffects.push(...sideEffects);
    return this;
  }

  resolvers(resolvers) {
    for (const resolver of resolvers) {
      const {
        [PRIVATE]: { name }
      } = resolver;
      this[PRIVATE].resolvers.set(name, resolver);
    }

    return this;
  }

  eventStore(eventStoreCollectionName) {
    this[PRIVATE].eventStoreCollectionName = eventStoreCollectionName;
    this[PRIVATE].eventStoreMetaCollectionName = `${eventStoreCollectionName}-meta`;
    return this;
  }

  database(databaseName) {
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
    const collectionPromises = [];
    collectionPromises.push(
      database.createCollection(eventStoreCollectionName, {
        session
      }),
      database.createCollection(eventStoreMetaCollectionName, {
        session
      })
    );

    for (const {
      [PRIVATE]: { name }
    } of projections) {
      collectionPromises.push(
        database.createCollection(name, {
          session
        })
      );
    }

    await Promise.all(collectionPromises);
    const eventStore = database.collection(eventStoreCollectionName);
    const eventStoreMeta = database.collection(eventStoreMetaCollectionName);
    const indexPromises = [];
    indexPromises.push(
      eventStore.createIndex(
        {
          'entityId.documentId': 1,
          'entityId.entityName': 1
        },
        {
          session
        }
      ),
      eventStore.createIndex(
        {
          'entityId.documentVersion': 1
        },
        {
          session
        }
      ),
      eventStoreMeta.createIndex(
        {
          entityName: 1,
          documentId: 1
        },
        {
          session
        }
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
    const cursor = eventStore
      .find(
        {},
        {
          session,
          projection: {
            _id: 0
          }
        }
      )
      .sort({
        'entityId.documentVersion': 1
      });

    while (await cursor.hasNext()) {
      const item = await cursor.next();
      const { entityId: entityIds, ...event } = item;
      const countEntityIds = entityIds.length;

      for (let entityIdIndex = 0; entityIdIndex < countEntityIds; entityIdIndex++) {
        const { entityName, documentId } = entityIds[entityIdIndex];
        const collection = database.collection(entityName);
        const documentIdAsObjectId = new mongodb.ObjectId(documentId);

        for (let projectionIndex = 0; projectionIndex < countProjections; projectionIndex++) {
          const projection = projections[projectionIndex];
          const eventHandler = projection[PRIVATE].eventHandlers[event.type];

          if (entityName === projection[PRIVATE].name && eventHandler != null) {
            const iterator = eventHandler({
              event,
              documentId,
              api: effectFactory
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

  async drop(options) {
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
    const collections = [];
    const databasePromises = [];

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
        collection
          .drop({
            session
          })
          .catch(function(error) {
            if (error.code != 26) {
              throw error;
            }
          })
      );
    }
  }

  async publish(events) {
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
    const databasePromises = [];
    const session = await builderSession;
    await session.startTransaction();
    const database = await (await builderClient).db(databaseName);
    const eventStore = database.collection(eventStoreCollectionName);
    const eventStoreMeta = database.collection(eventStoreMetaCollectionName);
    const entityIdsByEvent = new WeakMap();

    try {
      for (let eventIndex = 0; eventIndex < countEvents; eventIndex++) {
        const event = events[eventIndex];
        const entityIds = extractEntityIdsFromEvent(event);
        entityIdsByEvent.set(event, entityIds);
      }

      for (let eventIndex = 0; eventIndex < countEvents; eventIndex++) {
        const event = events[eventIndex];
        const entityIds = entityIdsByEvent.get(event);
        const countEntityIds = entityIds.length;
        const entityNameIndexes = new Map();

        for (let entityIdIndex = 0; entityIdIndex < countEntityIds; entityIdIndex++) {
          const { entityName, documentId } = entityIds[entityIdIndex];
          const documentIdAsObjectId = new mongodb.ObjectId(documentId);
          entityNameIndexes.set(entityName, entityIdIndex);
          const { documentVersion: originalDocumentVersion } =
            (await eventStoreMeta.findOne(
              {
                entityName,
                documentId: documentIdAsObjectId
              },
              {
                projection: {
                  documentVersion: 1
                },
                session
              }
            )) || {};
          let documentVersion = originalDocumentVersion;
          const collection = database.collection(entityName);
          const projection = projections.find(({ [PRIVATE]: { name } }) => name === entityName);

          if (projection != null) {
            const eventHandler = projection[PRIVATE].eventHandlers[event.type];

            if (entityName === projection[PRIVATE].name && eventHandler != null) {
              const iterator = eventHandler({
                event,
                documentId,
                api: effectFactory
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

              documentVersion = ~~documentVersion + 1;
            }
          }

          entityIds[entityIdIndex].documentVersion = documentVersion;
        }

        for (const entityIdIndex of entityNameIndexes.values()) {
          const { entityName, documentVersion, documentId } = entityIds[entityIdIndex];
          const documentIdAsObjectId = new mongodb.ObjectId(documentId);
          await eventStoreMeta.updateOne(
            {
              entityName,
              documentId: documentIdAsObjectId
            },
            {
              $set: {
                documentVersion
              }
            },
            {
              session,
              upsert: true
            }
          );
        }

        await eventStore.updateOne(
          {
            _id: new mongodb.ObjectId()
          },
          {
            $currentDate: {
              timestamp: true
            },
            $setOnInsert: { ...event, entityId: entityIds }
          },
          {
            session,
            upsert: true
          }
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
              await eventHandler({
                event,
                documentId,
                api: effectFactory
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

  async read(resolverName, resolverArgs) {
    const { resolvers, builderClient, builderSession, databaseName } = this[PRIVATE];
    const resolver = resolvers.get(resolverName);

    if (resolver == null) {
      throw new Error(`The resolver "${resolverName}" is not found`);
    }

    const session = await builderSession;
    const database = await (await builderClient).db(databaseName);
    return resolver.read(
      {
        database,
        session
      },
      resolverArgs
    );
  }
}
const domain = {
  connect(builderClient, resolverClient) {
    const instance = new Domain();
    return instance.connect(builderClient, resolverClient);
  },

  projections(projections) {
    const instance = new Domain();
    return instance.projections(projections);
  },

  sideEffects(projections) {
    const instance = new Domain();
    return instance.sideEffects(projections);
  },

  eventStore(eventStoreCollectionName) {
    const instance = new Domain();
    return instance.eventStore(eventStoreCollectionName);
  },

  resolvers(resolvers) {
    const instance = new Domain();
    return instance.resolvers(resolvers);
  } // close() {
  //   const instance = new Domain();
  //   return instance.close();
  // }
};

class Projection {
  constructor() {
    Object.defineProperty(this, PRIVATE, {
      value: Object.create(null)
    });
    this[PRIVATE].eventHandlers = {};
    this[PRIVATE].indexes = [];
  }

  name(name) {
    if (this[PRIVATE].name != null) {
      throw new Error(`Name already exists`);
    }

    this[PRIVATE].name = name;
    return this;
  }

  index(keyAndIndexTypeSpecification, options) {
    this[PRIVATE].indexes.push(
      options != null ? [keyAndIndexTypeSpecification, options] : [keyAndIndexTypeSpecification]
    );
    return this;
  }

  on(eventType, eventHandler) {
    if (this[PRIVATE].eventHandlers[eventType] != null) {
      throw new Error(`Event handler "${eventType}" already exists`);
    }

    this[PRIVATE].eventHandlers[eventType] = eventHandler;
    return this;
  }
}
const projection = {
  name(name) {
    const instance = new Projection();
    return instance.name(name);
  },

  index(keyAndIndexTypeSpecification, options) {
    const instance = new Projection();
    return instance.index(keyAndIndexTypeSpecification, options);
  },

  on(eventType, eventHandler) {
    const instance = new Projection();
    return instance.on(eventType, eventHandler);
  }
};

class SideEffect {
  constructor() {
    Object.defineProperty(this, PRIVATE, {
      value: Object.create(null)
    });
    this[PRIVATE].eventHandlers = {};
  }

  name(name) {
    if (this[PRIVATE].name != null) {
      throw new Error(`Name already exists`);
    }

    this[PRIVATE].name = name;
    return this;
  }

  index(keyAndIndexTypeSpecification, options) {
    this[PRIVATE].indexes.push(
      options != null ? [keyAndIndexTypeSpecification, options] : [keyAndIndexTypeSpecification]
    );
  }

  on(eventType, eventHandler) {
    if (this[PRIVATE].eventHandlers[eventType] != null) {
      throw new Error(`Event handler "${eventType}" already exists`);
    }

    this[PRIVATE].eventHandlers[eventType] = eventHandler;
    return this;
  }
}
const sideEffect = {
  name(name) {
    const instance = new SideEffect();
    return instance.name(name);
  },

  index(keyAndIndexTypeSpecification, options) {
    this[PRIVATE].indexes.push(
      options != null ? [keyAndIndexTypeSpecification, options] : [keyAndIndexTypeSpecification]
    );
  },

  on(eventType, eventHandler) {
    const instance = new SideEffect();
    return instance.on(eventType, eventHandler);
  }
};

class Resolver {
  constructor() {
    Object.defineProperty(this, PRIVATE, {
      value: Object.create(null)
    });
    this.read = this.read.bind(this);
  }

  name(name) {
    if (this[PRIVATE].name != null) {
      throw new Error(`The name "${name}" already exists`);
    }

    this[PRIVATE].name = name;
    return this;
  }

  on(on) {
    if (this[PRIVATE].on != null) {
      throw new Error(`Reader already exists`);
    }

    this[PRIVATE].on = on;
    return this;
  }

  read(client, args) {
    return this[PRIVATE].on(client, args);
  }
}
const resolver = {
  name(name) {
    const instance = new Resolver();
    return instance.name(name);
  },

  on(on) {
    const instance = new Resolver();
    return instance.on(on);
  }
};

function wrap(value) {
  if (value instanceof EntityId) {
    return {
      t: 'e',
      v: [value.entityName, value.documentId]
    };
  }

  if (Array.isArray(value)) {
    return recursiveWrap(value);
  } else if (value === Object(value)) {
    return {
      t: 'o',
      v: recursiveWrap(value)
    };
  } else {
    return recursiveWrap(value);
  }
}

function recursiveWrap(source) {
  if (Array.isArray(source)) {
    return source.map(value => wrap(value));
  } else if (source === Object(source)) {
    const copyValue = {};

    for (let key in source) {
      if (!source.hasOwnProperty(key)) {
        continue;
      }

      copyValue[key] = wrap(source[key]);
    }

    return copyValue;
  } else {
    return source;
  }
}

const serialize = events => {
  const eventCount = events.length;
  const result = [];

  for (let eventIndex = 0; eventIndex < eventCount; eventIndex++) {
    const event = events[eventIndex];
    result.push({ ...event, payload: recursiveWrap(event.payload) });
  }

  return JSON.stringify(result);
};

function unwrap(value) {
  if (Array.isArray(value)) {
    return recursiveUnwrap(value);
  } else if (value === Object(value)) {
    if (value.t === 'e') {
      return entityId(value.v[0], value.v[1]);
    } else if (value.t === 'o') {
      return recursiveUnwrap(value.v);
    } else {
      throw new Error(`Incorrect value ${JSON.stringify(value)}`);
    }
  } else {
    return recursiveUnwrap(value);
  }
}

function recursiveUnwrap(source) {
  if (Array.isArray(source)) {
    return source.map(value => unwrap(value));
  } else if (source === Object(source)) {
    const copyValue = {};

    for (let key in source) {
      if (!source.hasOwnProperty(key)) {
        continue;
      }

      copyValue[key] = unwrap(source[key]);
    }

    return copyValue;
  } else {
    return source;
  }
}

function deserialize(eventsAsString) {
  const events = JSON.parse(eventsAsString);
  const eventCount = events.length;

  for (let eventIndex = 0; eventIndex < eventCount; eventIndex++) {
    const event = events[eventIndex];

    if (event.hasOwnProperty('payload')) {
      event.payload = recursiveUnwrap(event.payload);
    }
  }

  return events;
}

exports.Domain = Domain;
exports.EntityId = EntityId;
exports.Projection = Projection;
exports.Resolver = Resolver;
exports.SideEffect = SideEffect;
exports.deserialize = deserialize;
exports.domain = domain;
exports.entityId = entityId;
exports.projection = projection;
exports.resolver = resolver;
exports.serialize = serialize;
exports.sideEffect = sideEffect;
//# sourceMappingURL=server.js.map
