import { TValue, MongoContext, Effect, EffectType } from '../types';

export async function processor(context: MongoContext, effect: Effect) {
  const { session, collection, documentId } = context;
  const { type, key, value, sliceSize } = effect;
  switch (type) {
    case EffectType.SET: {
      if (key.length === 0) {
        await collection.replaceOne(
          { _id: documentId },
          {
            ...value
          },
          {
            session,
            upsert: true
          }
        );
      } else {
        await collection.updateOne(
          { _id: documentId },
          {
            $set: {
              [key.join('.')]: value
            }
          },
          { session, upsert: true }
        );
      }

      break;
    }
    case EffectType.REMOVE: {
      if (key.length === 0) {
        await collection.deleteOne({ _id: documentId }, { session });
      } else {
        await collection.updateOne(
          { _id: documentId },
          {
            $unset: {
              [key.join('.')]: ''
            }
          },
          { session, upsert: true }
        );
      }
      break;
    }
    case EffectType.MERGE: {
      const $set: { [key: string]: TValue } = {};
      for (let kv in value) {
        if (!value.hasOwnProperty(kv)) {
          continue;
        }
        $set[[...key, kv].join('.')] = value[kv];
      }

      await collection.updateOne(
        { _id: documentId },
        {
          $set
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.SET_MAXIMUM: {
      await collection.updateOne(
        { _id: documentId },
        {
          $max: {
            [key.join('.')]: value
          }
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.SET_MINIMUM: {
      await collection.updateOne(
        { _id: documentId },
        {
          $min: {
            [key.join('.')]: value
          }
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.INCREMENT: {
      await collection.updateOne(
        { _id: documentId },
        {
          $inc: {
            [key.join('.')]: value
          }
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.DECREMENT: {
      await collection.updateOne(
        { _id: documentId },
        {
          $inc: {
            [key.join('.')]: -value
          }
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.MULTIPLY: {
      await collection.updateOne(
        { _id: documentId },
        {
          $mul: {
            [key.join('.')]: value
          }
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.DIVIDE: {
      await collection.updateOne(
        { _id: documentId },
        {
          $mul: {
            [key.join('.')]: 1 / value
          }
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.RENAME: {
      const newKey = value;
      await collection.updateOne(
        { _id: documentId },
        {
          $rename: {
            [key.join('.')]: [].concat(newKey).join('.')
          }
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.ADD_TO_SET: {
      const items = [].concat(value);

      await collection.updateOne(
        { _id: documentId },
        {
          $addToSet: {
            [key.join('.')]: {
              $each: items
            }
          }
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.PUSH_FRONT: {
      const items = [].concat(value);

      await collection.updateOne(
        { _id: documentId },
        {
          $push: {
            [key.join('.')]: {
              $each: items,
              $position: 0
            }
          }
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.POP_FRONT: {
      await collection.updateOne(
        { _id: documentId },
        {
          $pop: {
            [key.join('.')]: -1
          }
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.PUSH_BACK: {
      const items = [].concat(value);

      await collection.updateOne(
        { _id: documentId },
        {
          $push: {
            [key.join('.')]: {
              $each: items
            }
          }
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.POP_BACK: {
      await collection.updateOne(
        { _id: documentId },
        {
          $pop: {
            [key.join('.')]: 1
          }
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.PULL_IN: {
      const items = [].concat(value);

      await collection.updateOne(
        { _id: documentId },
        {
          $pull: {
            [key.join('.')]: {
              $in: items
            }
          }
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.PULL_NIN: {
      const items = [].concat(value);

      await collection.updateOne(
        { _id: documentId },
        {
          $pull: {
            [key.join('.')]: { $nin: items }
          }
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.PULL_EQ: {
      await collection.updateOne(
        { _id: documentId },
        {
          $pull: {
            [key.join('.')]: { $in: [value] }
          }
        },
        { session, upsert: true }
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
        { _id: documentId },
        {
          $pull: {
            [key.join('.')]: { $gt: value }
          }
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.PULL_GTE: {
      if (Object(value) === value) {
        throw new TypeError();
      }

      await collection.updateOne(
        { _id: documentId },
        {
          $pull: {
            [key.join('.')]: { $gte: value }
          }
        },
        { session, upsert: true }
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
        { _id: documentId },
        {
          $pull: {
            [key.join('.')]: { $lt: value }
          }
        },
        { session, upsert: true }
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
        { _id: documentId },
        {
          $pull: {
            [key.join('.')]: { $lte: value }
          }
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.PULL_NE: {
      await collection.updateOne(
        { _id: documentId },
        {
          $pull: {
            [key.join('.')]: { $ne: value }
          }
        },
        { session, upsert: true }
      );
      break;
    }
    case EffectType.GET: {
      const keyLength = key.length;

      const projection =
        keyLength === 0
          ? { _id: 0, _version: 0 }
          : {
              [key.join('.')]: 1,
              _id: 0
            };

      const result = await collection.findOne({ _id: documentId }, { projection, session });

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
