import { ImmutableContext, TStrictKey } from '../types';

export function validateRenameKey(context: ImmutableContext, target: any, key: TStrictKey): void {
  let isSourceArray = false;

  const lastIndex = key.length;

  let pointer = context.state;
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
