import { ImmutableContext, TStrictKey, TValue } from '../types';
import { isNonNegativeInteger } from './is-non-negative-integer';

export function setIn(context: ImmutableContext, key: TStrictKey, value: TValue = null) {
  const state = context.state;

  let lastKeyIndex = key.length - 1;
  if (lastKeyIndex === -1) {
    if (value == null || value.constructor !== Object) {
      throw new Error(`${JSON.stringify(value)} must be object`);
    }
    context.state = value;
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
