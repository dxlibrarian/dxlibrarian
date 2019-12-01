import deasync from 'deasync';
import { Collection, ClientSession, ObjectId } from 'mongodb';

import { MutationApi, TMutationApi, TStrictKey, TKey, TValue } from './mutation-api';
import { PRIVATE } from '../constants';

function deasyncify(collection: any, method: Function, ...args: Array<any>): any {
  let done = false;
  let result = null,
    error;
  method
    .apply(collection, args)
    .then(function(res: any): void {
      result = res;
      done = true;
    })
    .catch(function(err: Error): void {
      error = err;
      done = true;
    });
  deasync.loopWhile(function(): boolean {
    return !done;
  });
  if (error) {
    throw error;
  }
  return result;
}

export class MutationMongoApi extends MutationApi implements TMutationApi {
  [PRIVATE]: {
    collection: Collection;
    documentId: ObjectId;
    session: ClientSession;
  };

  // write (base)

  set(key: TStrictKey, value: TValue) {
    const { collection, documentId, session } = this[PRIVATE];

    if (key.length === 0) {
      const { _version = 0 } =
        deasyncify(collection, collection.findOne, { _id: documentId }, { session, projection: { _version: 1 } }) || {};

      deasyncify(
        collection,
        collection.replaceOne,
        { _id: documentId },
        { ...value, _version: _version + 1 },
        {
          session,
          upsert: true
        }
      );
    } else {
      deasyncify(
        collection,
        collection.updateOne,
        { _id: documentId },
        {
          $inc: {
            _version: 1
          },
          $set: {
            [key.join('.')]: value
          }
        },
        { session, upsert: true }
      );
    }
  }

  remove(key: TStrictKey) {
    const { collection, documentId, session } = this[PRIVATE];

    if (key.length === 0) {
      const { _version = 0 } =
        deasyncify(collection, collection.findOne, { _id: documentId }, { session, projection: { _version: 1 } }) || {};

      deasyncify(
        collection,
        collection.replaceOne,
        { _id: documentId },
        { _id: documentId, _version: _version + 1 },
        { session, upsert: true }
      );
      return;
    }

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $unset: {
          [key.join('.')]: ''
        }
      },
      { session, upsert: true }
    );
  }

  merge(key: TStrictKey, value: TValue) {
    const { collection, documentId, session } = this[PRIVATE];

    const $set: { [key: string]: TValue } = {};
    for (let kv in value) {
      if (!value.hasOwnProperty(kv)) {
        continue;
      }
      $set[[...key, kv].join('.')] = value[kv];
    }

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $set
      },
      { session, upsert: true }
    );
  }

  // write (advanced)

  setMaximum(key: TStrictKey, value: TValue) {
    const { collection, documentId, session } = this[PRIVATE];

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $max: {
          [key.join('.')]: value
        }
      },
      { session, upsert: true }
    );
  }

  setMinimum(key: TStrictKey, value: TValue) {
    const { collection, documentId, session } = this[PRIVATE];

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $min: {
          [key.join('.')]: value
        }
      },
      { session, upsert: true }
    );
  }

  increment(key: TStrictKey, value: TValue) {
    const { collection, documentId, session } = this[PRIVATE];

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          [key.join('.')]: value,
          _version: 1
        }
      },
      { session, upsert: true }
    );
  }

  decrement(key: TStrictKey, value: TValue) {
    const { collection, documentId, session } = this[PRIVATE];

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          [key.join('.')]: -value,
          _version: 1
        }
      },
      { session, upsert: true }
    );
  }

  multiply(key: TStrictKey, value: TValue) {
    const { collection, documentId, session } = this[PRIVATE];

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $mul: {
          [key.join('.')]: value
        }
      },
      { session, upsert: true }
    );
  }

  divide(key: TStrictKey, value: TValue) {
    const { collection, documentId, session } = this[PRIVATE];

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $mul: {
          [key.join('.')]: 1 / value
        }
      },
      { session, upsert: true }
    );
  }

  rename(key: TStrictKey, newKey: TKey) {
    const { collection, documentId, session } = this[PRIVATE];

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $rename: {
          [key.join('.')]: [].concat(newKey).join('.')
        }
      },
      { session, upsert: true }
    );
  }

  addToSet(key: TStrictKey, values: Array<TValue>) {
    const { collection, documentId, session } = this[PRIVATE];

    const items = [].concat(values);

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $addToSet: {
          [key.join('.')]: {
            $each: items
          }
        }
      },
      { session, upsert: true }
    );
  }

  pushFront(key: TStrictKey, values: Array<TValue>, sliceSize: number) {
    const { collection, documentId, session } = this[PRIVATE];

    const items = [].concat(values);

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $push: {
          [key.join('.')]: {
            $each: items,
            $position: 0
          }
        }
      },
      { session, upsert: true }
    );
  }

  popFront(key: TStrictKey) {
    const { collection, documentId, session } = this[PRIVATE];

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $pop: {
          [key.join('.')]: -1
        }
      },
      { session, upsert: true }
    );
  }

  pushBack(key: TStrictKey, values: Array<TValue>, sliceSize: number) {
    const { collection, documentId, session } = this[PRIVATE];

    const items = [].concat(values);

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $push: {
          [key.join('.')]: {
            $each: items
          }
        }
      },
      { session, upsert: true }
    );
  }

  popBack(key: TStrictKey) {
    const { collection, documentId, session } = this[PRIVATE];

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $pop: {
          [key.join('.')]: 1
        }
      },
      { session, upsert: true }
    );
  }

  pullIN(key: TStrictKey, values: Array<TValue>) {
    const { collection, documentId, session } = this[PRIVATE];

    const items = [].concat(values);

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $pull: {
          [key.join('.')]: {
            $in: items
          }
        }
      },
      { session, upsert: true }
    );
  }

  pullNIN(key: TStrictKey, values: Array<TValue>) {
    const { collection, documentId, session } = this[PRIVATE];

    const items = [].concat(values);

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $pull: {
          [key.join('.')]: { $nin: items }
        }
      },
      { session, upsert: true }
    );
  }

  pullEQ(key: TStrictKey, value: TValue) {
    const { collection, documentId, session } = this[PRIVATE];

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $pull: {
          [key.join('.')]: { $in: [value] }
        }
      },
      { session, upsert: true }
    );
  }

  pullGT(key: TStrictKey, value: TValue) {
    if (Object(value) === value) {
      throw new TypeError();
    }

    const { collection, documentId, session } = this[PRIVATE];

    if (Array.isArray(value)) {
      throw new TypeError();
    }

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $pull: {
          [key.join('.')]: { $gt: value }
        }
      },
      { session, upsert: true }
    );
  }

  pullGTE(key: TStrictKey, value: TValue) {
    if (Object(value) === value) {
      throw new TypeError();
    }

    const { collection, documentId, session } = this[PRIVATE];

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $pull: {
          [key.join('.')]: { $gte: value }
        }
      },
      { session, upsert: true }
    );
  }

  pullLT(key: TStrictKey, value: TValue) {
    if (Object(value) === value) {
      throw new TypeError();
    }

    const { collection, documentId, session } = this[PRIVATE];

    if (Array.isArray(value)) {
      throw new TypeError();
    }

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $pull: {
          [key.join('.')]: { $lt: value }
        }
      },
      { session, upsert: true }
    );
  }

  pullLTE(key: TStrictKey, value: TValue) {
    if (Object(value) === value) {
      throw new TypeError();
    }

    const { collection, documentId, session } = this[PRIVATE];

    if (Array.isArray(value)) {
      throw new TypeError();
    }

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $pull: {
          [key.join('.')]: { $lte: value }
        }
      },
      { session, upsert: true }
    );
  }

  pullNE(key: TStrictKey, value: TValue) {
    const { collection, documentId, session } = this[PRIVATE];

    deasyncify(
      collection,
      collection.updateOne,
      { _id: documentId },
      {
        $inc: {
          _version: 1
        },
        $pull: {
          [key.join('.')]: { $ne: value }
        }
      },
      { session, upsert: true }
    );
  }

  // read

  get(key: TStrictKey) {
    const { collection, documentId, session } = this[PRIVATE];

    const keyLength = key.length;

    const projection =
      keyLength === 0
        ? { _id: 0, _version: 0 }
        : {
            [key.join('.')]: 1,
            _id: 0,
            _version: 0
          };

    const result = deasyncify(collection, collection.findOne, { _id: documentId }, { projection, session });

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
