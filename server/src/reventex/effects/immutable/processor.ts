import { ImmutableContext, Effect } from '../types';
import { EffectType } from '../types';
import { checkPrimitive } from './check-primitive';
import { compareEQ, compareGT, compareGTE, compareLT, compareLTE } from './compare';
import { deepCompare } from './deep-compare';
import { deepFreeze } from './deep-freeze';
import { getIn } from './get-in';
import { setIn } from './set-in';
import { removeIn } from './remove-in';
import { getUniqueValues } from './get-unique-values';
import { immutableClone } from './immutable-clone';
import { mergeIn } from './merge-in';
import { pullWithCompare } from './pull-with-compare';
import { validateRenameKey } from './validate-rename-key';

export function processor(context: ImmutableContext, effect: Effect) {
  const { type, key, value, sliceSize } = effect;
  // console.log('state', context.state)
  // console.log('effect', effect)
  switch (type) {
    case EffectType.SET: {
      immutableClone(context, key, true);

      setIn(context, key, value);

      deepFreeze(context.state);
      break;
    }
    case EffectType.REMOVE: {
      if (key.length === 0) {
        context.state = null;
        return;
      }
      const prevValue = getIn(context, key);
      if (prevValue !== undefined) {
        immutableClone(context, key, true);

        removeIn(context, key);

        deepFreeze(context.state);
      }
      break;
    }
    case EffectType.MERGE: {
      immutableClone(context, key);

      mergeIn(context, key, value);

      deepFreeze(context.state);
      break;
    }
    case EffectType.SET_MAXIMUM: {
      const prevValue = getIn(context, key);

      if ((value === null && prevValue === undefined) || prevValue == null || (value > prevValue && value !== null)) {
        immutableClone(context, key, true);

        setIn(context, key, value);

        deepFreeze(context.state);
      }
      break;
    }
    case EffectType.SET_MINIMUM: {
      const prevValue = getIn(context, key);

      if (value == null || (prevValue !== null && (prevValue === undefined || value < prevValue))) {
        immutableClone(context, key, true);

        setIn(context, key, value);

        deepFreeze(context.state);
      }
      break;
    }
    case EffectType.INCREMENT: {
      if (value !== Number(value)) {
        throw new Error(`Cannot increment with non-numeric argument: { ${key.join('.')}: ${JSON.stringify(value)} }`);
      }

      let prevValue = getIn(context, key);
      if (prevValue === undefined) {
        prevValue = 0;
      }

      if (prevValue !== Number(prevValue)) {
        throw new Error(
          `Cannot apply $inc to a value of non-numeric type. ${JSON.stringify(
            context.state
          )} has the field ${JSON.stringify(key.join('.'))} of non-numeric type ${JSON.stringify(typeof prevValue)}`
        );
      }

      immutableClone(context, key, true);

      setIn(context, key, prevValue + value);

      deepFreeze(context.state);
      break;
    }
    case EffectType.DECREMENT: {
      if (value !== Number(value)) {
        throw new Error(`Cannot increment with non-numeric argument: { ${key.join('.')}: ${JSON.stringify(value)} }`);
      }

      let prevValue = getIn(context, key);
      if (prevValue === undefined) {
        prevValue = 0;
      }

      if (prevValue !== Number(prevValue)) {
        throw new Error(
          `Cannot apply $inc to a value of non-numeric type. ${JSON.stringify(
            context.state
          )} has the field ${JSON.stringify(key.join('.'))} of non-numeric type ${JSON.stringify(typeof prevValue)}`
        );
      }

      immutableClone(context, key, true);

      setIn(context, key, prevValue - value);

      deepFreeze(context.state);
      break;
    }
    case EffectType.MULTIPLY: {
      if (value !== Number(value)) {
        throw new Error(`Cannot multiply with non-numeric argument: { ${key.join('.')}: ${JSON.stringify(value)} }`);
      }

      let prevValue = getIn(context, key);
      if (prevValue === undefined) {
        prevValue = 0;
      }

      if (prevValue !== Number(prevValue)) {
        throw new Error(
          `Cannot apply $mul to a value of non-numeric type. ${JSON.stringify(
            context.state
          )} has the field ${JSON.stringify(key.join('.'))} of non-numeric type ${JSON.stringify(typeof prevValue)}`
        );
      }

      immutableClone(context, key, true);

      setIn(context, key, prevValue * value);

      deepFreeze(context.state);
      break;
    }
    case EffectType.DIVIDE: {
      if (value !== Number(value)) {
        throw new Error(`Cannot increment with non-numeric argument: { ${key.join('.')}: ${JSON.stringify(value)} }`);
      }

      let prevValue = getIn(context, key);
      if (prevValue === undefined) {
        prevValue = 0;
      }

      if (prevValue !== Number(prevValue)) {
        throw new Error(
          `Cannot apply $mul to a value of non-numeric type. ${JSON.stringify(
            context.state
          )} has the field ${JSON.stringify(key.join('.'))} of non-numeric type ${JSON.stringify(typeof prevValue)}`
        );
      }

      immutableClone(context, key, true);

      setIn(context, key, prevValue / value);

      deepFreeze(context.state);
      break;
    }
    case EffectType.RENAME: {
      const newKey = value;

      const prevValue = getIn(context, key);

      if (prevValue !== undefined) {
        validateRenameKey(context, 'source', key);
        validateRenameKey(context, 'destination', newKey);

        immutableClone(context, key, true);
        immutableClone(context, newKey, true);

        setIn(context, newKey, prevValue);

        removeIn(context, key);

        deepFreeze(context.state);
      }
      break;
    }
    case EffectType.ADD_TO_SET: {
      let prevValue = getIn(context, key);

      if (prevValue === undefined) {
        prevValue = [];
      }

      if (!Array.isArray(prevValue)) {
        throw new Error(
          `Cannot apply $addToSet to non-array field. ${JSON.stringify(context.state)} has the field ${JSON.stringify(
            key.join('.')
          )} of non-array type ${JSON.stringify(typeof prevValue)}`
        );
      }

      immutableClone(context, key, true);

      const items = getUniqueValues(prevValue.concat(value));

      setIn(context, key, items);

      deepFreeze(context.state);
      break;
    }
    case EffectType.PUSH_FRONT: {
      let prevValue = getIn(context, key);

      if (prevValue === undefined) {
        prevValue = [];
      }

      if (!Array.isArray(prevValue)) {
        throw new Error(
          `Cannot apply $push to non-array field. ${JSON.stringify(context.state)} has the field ${JSON.stringify(
            key.join('.')
          )} of non-array type ${JSON.stringify(typeof prevValue)}`
        );
      }

      immutableClone(context, key, true);

      const items = [].concat(value, prevValue);

      setIn(context, key, items);

      deepFreeze(context.state);
      break;
    }
    case EffectType.POP_FRONT: {
      let prevValue = getIn(context, key);

      if (prevValue === undefined) {
        return;
      }

      if (!Array.isArray(prevValue)) {
        throw new Error(
          `Cannot apply $pop to non-array field. ${JSON.stringify(context.state)} has the field ${JSON.stringify(
            key.join('.')
          )} of non-array type ${JSON.stringify(typeof prevValue)}`
        );
      }

      immutableClone(context, key, true);

      const items = prevValue.slice(1);

      setIn(context, key, items);

      deepFreeze(context.state);
      break;
    }
    case EffectType.PUSH_BACK: {
      let prevValue = getIn(context, key);

      if (prevValue === undefined) {
        prevValue = [];
      }

      if (!Array.isArray(prevValue)) {
        throw new Error(
          `Cannot apply $push to non-array field. ${JSON.stringify(context.state)} has the field ${JSON.stringify(
            key.join('.')
          )} of non-array type ${JSON.stringify(typeof prevValue)}`
        );
      }

      immutableClone(context, key, true);

      const items = [].concat(prevValue, value);

      setIn(context, key, items);

      deepFreeze(context.state);
      break;
    }
    case EffectType.POP_BACK: {
      let prevValue = getIn(context, key);

      if (prevValue === undefined) {
        return;
      }

      if (!Array.isArray(prevValue)) {
        throw new Error(
          `Cannot apply $pop to non-array field. ${JSON.stringify(context.state)} has the field ${JSON.stringify(
            key.join('.')
          )} of non-array type ${JSON.stringify(typeof prevValue)}`
        );
      }

      immutableClone(context, key, true);

      const items = prevValue.slice(0, prevValue.length - 1);

      setIn(context, key, items);

      deepFreeze(context.state);
      break;
    }
    case EffectType.PULL_IN: {
      let prevValue = getIn(context, key);

      if (prevValue === undefined) {
        prevValue = [];
      }

      if (!Array.isArray(prevValue)) {
        throw new Error(
          `Cannot apply $pullAll to non-array field. ${JSON.stringify(context.state)} has the field ${JSON.stringify(
            key.join('.')
          )} of non-array type ${JSON.stringify(typeof prevValue)}`
        );
      }

      immutableClone(context, key, true);

      const items = [].concat(value);

      const itemsLength = items.length;
      const newValues = prevValue.filter(value => {
        for (let i = 0; i < itemsLength; i++) {
          if (Array.isArray(value)) {
            const valueLength = value.length;
            for (let j = 0; j < valueLength; j++) {
              if (deepCompare(value[j], items[i])) {
                return false;
              }
            }
          }
          if (deepCompare(value, items[i])) {
            return false;
          }
        }
        return true;
      });

      setIn(context, key, newValues);

      deepFreeze(context.state);
      break;
    }
    case EffectType.PULL_NIN: {
      let prevValue = getIn(context, key);

      if (prevValue === undefined) {
        prevValue = [];
      }

      if (!Array.isArray(prevValue)) {
        throw new Error(
          `Cannot apply $pullAll to non-array field. ${JSON.stringify(context.state)} has the field ${JSON.stringify(
            key.join('.')
          )} of non-array type ${JSON.stringify(typeof prevValue)}`
        );
      }

      immutableClone(context, key, true);

      const items = [].concat(value);

      const itemsLength = items.length;
      const newValues = prevValue.filter(value => {
        for (let i = 0; i < itemsLength; i++) {
          if (Array.isArray(value)) {
            const valueLength = value.length;
            for (let j = 0; j < valueLength; j++) {
              if (deepCompare(value[j], items[i])) {
                return true;
              }
            }
          }
          if (deepCompare(value, items[i])) {
            return true;
          }
        }
        return false;
      });

      setIn(context, key, newValues);

      deepFreeze(context.state);
      break;
    }
    case EffectType.PULL_EQ: {
      pullWithCompare(context, key, value, compareEQ);
      break;
    }
    case EffectType.PULL_GT: {
      checkPrimitive(value);
      pullWithCompare(context, key, value, compareGT);
      break;
    }
    case EffectType.PULL_GTE: {
      checkPrimitive(value);
      pullWithCompare(context, key, value, compareGTE);
      break;
    }
    case EffectType.PULL_LT: {
      checkPrimitive(value);
      pullWithCompare(context, key, value, compareLT);
      break;
    }
    case EffectType.PULL_LTE: {
      checkPrimitive(value);
      pullWithCompare(context, key, value, compareLTE);
      break;
    }
    case EffectType.PULL_NE: {
      pullWithCompare(context, key, value, compareEQ, true);
      break;
    }
    case EffectType.GET: {
      return getIn(context, key);
    }
  }
}
