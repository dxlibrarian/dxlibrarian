import { TMutationApi, TStrictKey, TValue, MutationApi, prepareKey } from './mutation-api';
import { PRIVATE } from '../constants';

export function compareGTE(a: TValue = null, b: TValue) {
  if (b === undefined) {
    throw new Error('Cannot compare to undefined');
  }
  return a === b || (b != null && a > b) || (a !== a && b !== b);
}

export function compareLTE(a: TValue = null, b: TValue) {
  if (b === undefined) {
    throw new Error('Cannot compare to undefined');
  }
  return a === b || (b != null && a < b) || (a !== a && b !== b);
}

export function compareGT(a: TValue = null, b: TValue) {
  if (b === undefined) {
    throw new Error('Cannot compare to undefined');
  }
  return b != null && a > b;
}

export function compareLT(a: TValue = null, b: TValue) {
  if (b === undefined) {
    throw new Error('Cannot compare to undefined');
  }
  return b != null && a < b;
}

export function compareEQ(a: TValue = null, b: TValue) {
  if (b === undefined) {
    throw new Error('Cannot compare to undefined');
  }
  return a === b || (a !== a && b !== b);
}

export function deepCompare(a: TValue = null, b: TValue = null, compare = compareEQ) {
  const isNullA = a === null;
  const isNullB = b === null;
  if (!isNullA && isNullB) {
    return false;
  } else if (isNullA && !isNullB) {
    return false;
  } else if (isNullA && isNullB) {
    return compare(a, b);
  }
  const isNaNA = a !== a;
  const isNaNB = b !== b;
  if (!isNaNA && isNaNB) {
    return false;
  } else if (isNaNA && !isNaNB) {
    return false;
  } else if (isNaNA && isNaNB) {
    return compare(a, b);
  }
  if (a.constructor !== b.constructor) {
    return false;
  }
  const isArrayA = Array.isArray(a);
  const isArrayB = Array.isArray(b);
  if (isArrayA && isArrayB) {
    const length = a.length;
    if (length !== b.length) {
      return false;
    }
    for (let i = length; i-- !== 0; ) {
      if (!deepCompare(a[i], b[i], compare)) {
        return false;
      }
    }

    return true;
  } else if (isArrayA && !isArrayB) {
    return false;
  } else if (!isArrayA && isArrayB) {
    return false;
  }
  const isObjectA = Object(a) === a;
  const isObjectB = Object(b) === b;
  if (isObjectA && isObjectB) {
    const keys = Object.keys(a);
    const length = keys.length;

    if (keys.toString().indexOf(Object.keys(b).toString()) !== 0) {
      return false;
    }

    for (let i = length; i-- !== 0; ) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) {
        return false;
      }
    }

    for (let i = length; i-- !== 0; ) {
      const key = keys[i];
      if (!deepCompare(a[key], b[key], compare)) {
        return false;
      }
    }

    return true;
  } else if (isObjectA && !isObjectB) {
    return false;
  } else if (!isObjectA && isObjectB) {
    return false;
  }

  return compare(a, b);
}

export function getUniqueValues(items: Array<TValue>): Array<TValue> {
  const uniqueValues = [];
  const length = items.length;
  for (let i = length - 1; i >= 0; i--) {
    let isDuplicate = false;
    const itemI = items[i];
    for (let j = 0; j < i; j++) {
      const itemJ = items[j];
      if (deepCompare(itemI, itemJ)) {
        isDuplicate = true;
      }
    }
    if (!isDuplicate) {
      uniqueValues.unshift(itemI);
    }
  }
  return uniqueValues;
}

type TState = {
  [key: string]: any;
};

function deepFreeze(state: TState): TState {
  for (let key in state) {
    if (state.hasOwnProperty(key)) {
      const subState = state[key];
      if (subState === undefined) {
        state[key] = null;
      }
      if (subState === Object(subState)) {
        deepFreeze(subState);
      }
    }
  }
  return Object.freeze(state);
}

function isNonNegativeInteger(value: TValue) {
  return value == parseInt(value, 10) && value >= 0;
}

function immutableClone(api: TMutationApi, key: TStrictKey, skipLastSubKey = false) {
  const internal = api as any;

  const state = internal[PRIVATE].state;

  const clonedState = { ...state };

  let pointer = clonedState;
  let keyLength = skipLastSubKey ? key.length - 1 : key.length;

  let inArray = false;
  for (let index = 0; index < keyLength; index++) {
    const subKey = key[index];

    if (Object(pointer) !== pointer || (Array.isArray(pointer) && !isNonNegativeInteger(subKey))) {
      throw new Error(`Cannot create field ${JSON.stringify(subKey)} in element ${JSON.stringify(pointer)}`);
    }

    if (Array.isArray(pointer[subKey])) {
      pointer[subKey] = [...pointer[subKey]];
      inArray = true;
    } else {
      if (inArray && isNonNegativeInteger(subKey)) {
        for (let arrIndex = 0; arrIndex < subKey; arrIndex++) {
          if (pointer[arrIndex] === undefined) {
            pointer[arrIndex] = null;
          }
        }
      }
      pointer[subKey] = { ...pointer[subKey] };
      inArray = false;
    }
    pointer = pointer[subKey];
  }

  api[PRIVATE].state = clonedState;
}

function setIn(api: MutationImmutableApi, key: TStrictKey, value: TValue = null) {
  const state = api[PRIVATE].state;

  let lastKeyIndex = key.length - 1;
  if (lastKeyIndex === -1) {
    if (value == null || value.constructor !== Object) {
      throw new Error(`${JSON.stringify(value)} must be object`);
    }
    api[PRIVATE].state = value;
  } else {
    let pointer = state;
    for (let index = 0; index < lastKeyIndex; index++) {
      const subKey = key[index];
      pointer = pointer[subKey];
    }
    const lastKey = key[lastKeyIndex];
    const isArray = Array.isArray(pointer);

    if (Object(pointer) !== pointer || (isArray && !isNonNegativeInteger(lastKey))) {
      throw new Error(`Cannot create field ${JSON.stringify(lastKey)} in element ${JSON.stringify(pointer)}`);
    }

    if (isArray && isNonNegativeInteger(lastKey)) {
      for (let arrIndex = 0; arrIndex < lastKey; arrIndex++) {
        if (pointer[arrIndex] === undefined) {
          pointer[arrIndex] = null;
        }
      }
    }

    pointer[lastKey] = value;
  }
}

function removeIn(api: MutationImmutableApi, key: TStrictKey) {
  const state = api[PRIVATE].state;

  let lastKeyIndex = key.length - 1;
  if (lastKeyIndex === -1) {
    throw new Error('Key must not be empty');
  } else {
    let pointer = state;
    for (let index = 0; index < lastKeyIndex; index++) {
      const subKey = key[index];
      pointer = pointer[subKey];
    }
    const lastKey = key[lastKeyIndex];
    const isArray = Array.isArray(pointer);

    delete pointer[lastKey];

    if (isArray && isNonNegativeInteger(lastKey)) {
      const lastArrIndex = Math.max(lastKey as number, pointer.length);
      for (let arrIndex = 0; arrIndex < lastArrIndex; arrIndex++) {
        if (pointer[arrIndex] === undefined) {
          pointer[arrIndex] = null;
        }
      }
    }
  }
}

function mergeIn(api: MutationImmutableApi, key: TStrictKey, value: TValue) {
  if (value == null || value.constructor !== Object) {
    throw new Error(`${JSON.stringify(value)} must be object`);
  }

  const state = api[PRIVATE].state;

  let lastKeyIndex = key.length;

  let pointer = state;
  for (let index = 0; index < lastKeyIndex; index++) {
    const subKey = key[index];
    pointer = pointer[subKey];
  }

  const isArray = Array.isArray(pointer);

  for (let valueKey in value) {
    if (value.hasOwnProperty(valueKey)) {
      if (Object(pointer) !== pointer || (isArray && !isNonNegativeInteger(valueKey))) {
        throw new Error(`Cannot create field ${JSON.stringify(valueKey)} in element ${JSON.stringify(pointer)}`);
      }
      const subValue = value[valueKey];
      pointer[valueKey] = subValue == null ? null : subValue;
    }
  }

  if (isArray) {
    for (let arrIndex = 0; arrIndex < pointer.length; arrIndex++) {
      if (pointer[arrIndex] === undefined) {
        pointer[arrIndex] = null;
      }
    }
  }
}

function getIn(api: MutationImmutableApi, key: TStrictKey) {
  const lastIndex = key.length;

  let pointer = api[PRIVATE].state;

  for (let index = 0; index < lastIndex; index++) {
    pointer = pointer[key[index]];

    if (pointer === undefined) {
      return undefined;
    }
  }
  return pointer;
}

function validateRenameKey(api: MutationImmutableApi, target: any, key: TStrictKey): void {
  let isSourceArray = false;

  const lastIndex = key.length;

  let pointer = api[PRIVATE].state;
  if (Array.isArray(pointer)) {
    isSourceArray = true;
  }

  for (let index = 0; index < lastIndex; index++) {
    pointer = pointer[key[index]];

    if (Array.isArray(pointer)) {
      isSourceArray = true;
      break;
    }

    if (pointer === undefined) {
      return;
    }
  }

  if (isSourceArray) {
    throw new Error(`The ${target} field cannot be an array element, ${JSON.stringify(key.join('.'))}`);
  }
}

function checkPrimitive(value: TValue) {
  if (value == null) {
    return;
  }
  const constructor = value.constructor;
  if (constructor === Object || constructor === Array) {
    throw `Value ${JSON.stringify(value)} must be primitive or Date`;
  }
}

function pullWithCompare(
  api: MutationImmutableApi,
  key: TStrictKey,
  value: TValue,
  compare: (a: any, b: any) => boolean,
  invert: boolean = false
) {
  let prevValue = getIn(api, key);

  if (prevValue === undefined) {
    prevValue = [];
  }

  if (!Array.isArray(prevValue)) {
    throw new Error(
      `Cannot apply $pullAll to non-array field. ${JSON.stringify(api[PRIVATE].state)} has the field ${JSON.stringify(
        key.join('.')
      )} of non-array type ${JSON.stringify(typeof prevValue)}`
    );
  }

  immutableClone(api, key, true);

  const newValues = prevValue.filter(item => {
    if (Array.isArray(item)) {
      const valueLength = item.length;
      for (let j = 0; j < valueLength; j++) {
        if (deepCompare(item[j], value, compare)) {
          return invert;
        }
      }
    }
    if (deepCompare(item, value, compare)) {
      return invert;
    }

    return !invert;
  });

  setIn(api, key, newValues);

  deepFreeze(api[PRIVATE].state);
}

export class MutationImmutableApi extends MutationApi implements TMutationApi {
  [PRIVATE]: {
    state: any;
  };

  constructor(options: any) {
    super(options);
    this[PRIVATE].state = {};
  }

  // write (base)

  set(key: TStrictKey, value: TValue) {
    immutableClone(this, key, true);

    setIn(this, key, value);

    deepFreeze(this[PRIVATE].state);
  }

  remove(key: TStrictKey) {
    if (key.length === 0) {
      this[PRIVATE].state = {};
      deepFreeze(this[PRIVATE].state);
      return;
    }
    const prevValue = getIn(this, key);
    if (prevValue !== undefined) {
      immutableClone(this, key, true);

      removeIn(this, key);

      deepFreeze(this[PRIVATE].state);
    }
  }

  merge(key: TStrictKey, value: TValue) {
    immutableClone(this, key);

    mergeIn(this, key, value);

    deepFreeze(this[PRIVATE].state);
  }

  // write (advanced)

  setMaximum(key: TStrictKey, value: TValue) {
    const prevValue = getIn(this, key);

    if ((value === null && prevValue === undefined) || prevValue == null || (value > prevValue && value !== null)) {
      immutableClone(this, key, true);

      setIn(this, key, value);

      deepFreeze(this[PRIVATE].state);
    }
  }

  setMinimum(key: TStrictKey, value: TValue) {
    const prevValue = getIn(this, key);

    if (value == null || (prevValue !== null && (prevValue === undefined || value < prevValue))) {
      immutableClone(this, key, true);

      setIn(this, key, value);

      deepFreeze(this[PRIVATE].state);
    }
  }

  increment(key: TStrictKey, value: TValue) {
    if (value !== Number(value)) {
      throw new Error(`Cannot increment with non-numeric argument: { ${key.join('.')}: ${JSON.stringify(value)} }`);
    }

    let prevValue = getIn(this, key);
    if (prevValue === undefined) {
      prevValue = 0;
    }

    if (prevValue !== Number(prevValue)) {
      throw new Error(
        `Cannot apply $inc to a value of non-numeric type. ${JSON.stringify(
          this[PRIVATE].state
        )} has the field ${JSON.stringify(key.join('.'))} of non-numeric type ${JSON.stringify(typeof prevValue)}`
      );
    }

    immutableClone(this, key, true);

    setIn(this, key, prevValue + value);

    deepFreeze(this[PRIVATE].state);
  }

  decrement(key: TStrictKey, value: TValue) {
    if (value !== Number(value)) {
      throw new Error(`Cannot increment with non-numeric argument: { ${key.join('.')}: ${JSON.stringify(value)} }`);
    }

    let prevValue = getIn(this, key);
    if (prevValue === undefined) {
      prevValue = 0;
    }

    if (prevValue !== Number(prevValue)) {
      throw new Error(
        `Cannot apply $inc to a value of non-numeric type. ${JSON.stringify(
          this[PRIVATE].state
        )} has the field ${JSON.stringify(key.join('.'))} of non-numeric type ${JSON.stringify(typeof prevValue)}`
      );
    }

    immutableClone(this, key, true);

    setIn(this, key, prevValue - value);

    deepFreeze(this[PRIVATE].state);
  }

  multiply(key: TStrictKey, value: TValue) {
    if (value !== Number(value)) {
      throw new Error(`Cannot multiply with non-numeric argument: { ${key.join('.')}: ${JSON.stringify(value)} }`);
    }

    let prevValue = getIn(this, key);
    if (prevValue === undefined) {
      prevValue = 0;
    }

    if (prevValue !== Number(prevValue)) {
      throw new Error(
        `Cannot apply $mul to a value of non-numeric type. ${JSON.stringify(
          this[PRIVATE].state
        )} has the field ${JSON.stringify(key.join('.'))} of non-numeric type ${JSON.stringify(typeof prevValue)}`
      );
    }

    immutableClone(this, key, true);

    setIn(this, key, prevValue * value);

    deepFreeze(this[PRIVATE].state);
  }

  divide(key: TStrictKey, value: TValue) {
    if (value !== Number(value)) {
      throw new Error(`Cannot increment with non-numeric argument: { ${key.join('.')}: ${JSON.stringify(value)} }`);
    }

    let prevValue = getIn(this, key);
    if (prevValue === undefined) {
      prevValue = 0;
    }

    if (prevValue !== Number(prevValue)) {
      throw new Error(
        `Cannot apply $mul to a value of non-numeric type. ${JSON.stringify(
          this[PRIVATE].state
        )} has the field ${JSON.stringify(key.join('.'))} of non-numeric type ${JSON.stringify(typeof prevValue)}`
      );
    }

    immutableClone(this, key, true);

    setIn(this, key, prevValue / value);

    deepFreeze(this[PRIVATE].state);
  }

  rename(key: TStrictKey, newKey: TStrictKey) {
    const prevValue = getIn(this, key);

    if (prevValue !== undefined) {
      const preparedNewKey = prepareKey(newKey);

      validateRenameKey(this, 'source', key);
      validateRenameKey(this, 'destination', preparedNewKey);

      immutableClone(this, key, true);
      immutableClone(this, preparedNewKey, true);

      setIn(this, preparedNewKey, prevValue);

      removeIn(this, key);

      deepFreeze(this[PRIVATE].state);
    }
  }

  addToSet(key: TStrictKey, values: TValue) {
    let prevValue = getIn(this, key);

    if (prevValue === undefined) {
      prevValue = [];
    }

    if (!Array.isArray(prevValue)) {
      throw new Error(
        `Cannot apply $addToSet to non-array field. ${JSON.stringify(
          this[PRIVATE].state
        )} has the field ${JSON.stringify(key.join('.'))} of non-array type ${JSON.stringify(typeof prevValue)}`
      );
    }

    immutableClone(this, key, true);

    const items = getUniqueValues(prevValue.concat(values));

    setIn(this, key, items);

    deepFreeze(this[PRIVATE].state);
  }

  pushFront(key: TStrictKey, values: TValue, sliceSize: number) {
    let prevValue = getIn(this, key);

    if (prevValue === undefined) {
      prevValue = [];
    }

    if (!Array.isArray(prevValue)) {
      throw new Error(
        `Cannot apply $push to non-array field. ${JSON.stringify(this[PRIVATE].state)} has the field ${JSON.stringify(
          key.join('.')
        )} of non-array type ${JSON.stringify(typeof prevValue)}`
      );
    }

    immutableClone(this, key, true);

    const items = [].concat(values, prevValue);

    setIn(this, key, items);

    deepFreeze(this[PRIVATE].state);
  }

  popFront(key: TStrictKey) {
    let prevValue = getIn(this, key);

    if (prevValue === undefined) {
      return;
    }

    if (!Array.isArray(prevValue)) {
      throw new Error(
        `Cannot apply $pop to non-array field. ${JSON.stringify(this[PRIVATE].state)} has the field ${JSON.stringify(
          key.join('.')
        )} of non-array type ${JSON.stringify(typeof prevValue)}`
      );
    }

    immutableClone(this, key, true);

    const items = prevValue.slice(1);

    setIn(this, key, items);

    deepFreeze(this[PRIVATE].state);
  }

  pushBack(key: TStrictKey, values: TValue, sliceSize: number) {
    let prevValue = getIn(this, key);

    if (prevValue === undefined) {
      prevValue = [];
    }

    if (!Array.isArray(prevValue)) {
      throw new Error(
        `Cannot apply $push to non-array field. ${JSON.stringify(this[PRIVATE].state)} has the field ${JSON.stringify(
          key.join('.')
        )} of non-array type ${JSON.stringify(typeof prevValue)}`
      );
    }

    immutableClone(this, key, true);

    const items = [].concat(prevValue, values);

    setIn(this, key, items);

    deepFreeze(this[PRIVATE].state);
  }

  popBack(key: TStrictKey) {
    let prevValue = getIn(this, key);

    if (prevValue === undefined) {
      return;
    }

    if (!Array.isArray(prevValue)) {
      throw new Error(
        `Cannot apply $pop to non-array field. ${JSON.stringify(this[PRIVATE].state)} has the field ${JSON.stringify(
          key.join('.')
        )} of non-array type ${JSON.stringify(typeof prevValue)}`
      );
    }

    immutableClone(this, key, true);

    const items = prevValue.slice(0, prevValue.length - 1);

    setIn(this, key, items);

    deepFreeze(this[PRIVATE].state);
  }

  pullIN(key: TStrictKey, values: TValue) {
    let prevValue = getIn(this, key);

    if (prevValue === undefined) {
      prevValue = [];
    }

    if (!Array.isArray(prevValue)) {
      throw new Error(
        `Cannot apply $pullAll to non-array field. ${JSON.stringify(
          this[PRIVATE].state
        )} has the field ${JSON.stringify(key.join('.'))} of non-array type ${JSON.stringify(typeof prevValue)}`
      );
    }

    immutableClone(this, key, true);

    const items = [].concat(values);

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

    setIn(this, key, newValues);

    deepFreeze(this[PRIVATE].state);
  }

  pullNIN(key: TStrictKey, values: TValue) {
    let prevValue = getIn(this, key);

    if (prevValue === undefined) {
      prevValue = [];
    }

    if (!Array.isArray(prevValue)) {
      throw new Error(
        `Cannot apply $pullAll to non-array field. ${JSON.stringify(
          this[PRIVATE].state
        )} has the field ${JSON.stringify(key.join('.'))} of non-array type ${JSON.stringify(typeof prevValue)}`
      );
    }

    immutableClone(this, key, true);

    const items = [].concat(values);

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

    setIn(this, key, newValues);

    deepFreeze(this[PRIVATE].state);
  }

  pullEQ(key: TStrictKey, value: TValue) {
    pullWithCompare(this, key, value, compareEQ);
  }

  pullGT(key: TStrictKey, value: TValue) {
    checkPrimitive(value);
    pullWithCompare(this, key, value, compareGT);
  }

  pullGTE(key: TStrictKey, value: TValue) {
    checkPrimitive(value);
    pullWithCompare(this, key, value, compareGTE);
  }

  pullLT(key: TStrictKey, value: TValue) {
    checkPrimitive(value);
    pullWithCompare(this, key, value, compareLT);
  }

  pullLTE(key: TStrictKey, value: TValue) {
    checkPrimitive(value);
    pullWithCompare(this, key, value, compareLTE);
  }

  pullNE(key: TStrictKey, value: TValue) {
    pullWithCompare(this, key, value, compareEQ, true);
  }

  // read

  get(key: TStrictKey) {
    return getIn(this, key);
  }
}
