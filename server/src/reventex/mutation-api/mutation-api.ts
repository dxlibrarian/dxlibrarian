import { PRIVATE } from '../constants';

export type TKey = string | number | Array<string | number>;
export type TStrictKey = Array<string | number>;
export type TValue = any;

export interface TMutationApi {
  [PRIVATE]: {
    [key: string]: any;
  };
  set(key: TKey, value: TValue): void;
  remove(key: TKey): void;
  merge(key: TKey, value: TValue): void;
  setMaximum(key: TKey, value: TValue): void;
  setMinimum(key: TKey, value: TValue): void;
  increment(key: TKey, value: TValue): void;
  decrement(key: TKey, value: TValue): void;
  multiply(key: TKey, value: TValue): void;
  divide(key: TKey, value: TValue): void;
  rename(key: TKey, newKey: TKey): void;
  addToSet(key: TKey, values: Array<TValue>): void;
  pushFront(key: TKey, value: TValue, sliceSize?: number): void;
  popFront(key: TKey): void;
  pushBack(key: TKey, value: TValue, sliceSize?: number): void;
  popBack(key: TKey): void;
  pullEQ(key: TKey, value: TValue): void;
  pullGT(key: TKey, value: TValue): void;
  pullGTE(key: TKey, value: TValue): void;
  pullLT(key: TKey, value: TValue): void;
  pullLTE(key: TKey, value: TValue): void;
  pullNE(key: TKey, value: TValue): void;
  pullIN(key: TKey, values: Array<TValue>): void;
  pullNIN(key: TKey, values: Array<TValue>): void;
  get(key: TKey): TValue;
}

export const prepareKey = (key: TKey): TStrictKey => {
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

const methodKVS = (self: any, callbackName: string) => {
  const callback = self[callbackName].bind(self);

  self[callbackName] = function(...args: Array<any>) {
    switch (args.length) {
      case 1: {
        const key: TKey = [];
        const value = args[0];
        return callback(key, value);
      }
      case 2:
      case 3: {
        const [key, value, sliceSize] = args;
        return callback(prepareKey(key), value, sliceSize);
      }
      default: {
        throw new TypeError();
      }
    }
  };
};

const methodKV = (self: any, callbackName: string) => {
  const callback = self[callbackName].bind(self);

  self[callbackName] = function(...args: Array<any>) {
    switch (args.length) {
      case 1: {
        const key: TKey = [];
        const value = args[0];
        return callback(key, value);
      }
      case 2: {
        const [key, value] = args;
        return callback(prepareKey(key), value);
      }
      default: {
        throw new TypeError();
      }
    }
  };
};

const methodK = (self: any, callbackName: string) => {
  const callback = self[callbackName].bind(self);

  self[callbackName] = function(...args: Array<any>) {
    switch (args.length) {
      case 0: {
        const key: TKey = [];
        return callback(key);
      }
      case 1: {
        const [key] = args;
        return callback(prepareKey(key));
      }
      default: {
        throw new TypeError();
      }
    }
  };
};

export class MutationApi {
  constructor(options = {}) {
    Object.freeze(options);

    const self = this as any;

    self[PRIVATE] = {
      options
    };

    methodKV(this, 'set');
    methodK(this, 'remove');
    methodKV(this, 'merge');
    methodKV(this, 'setMaximum');
    methodKV(this, 'setMinimum');
    methodKV(this, 'increment');
    methodKV(this, 'decrement');
    methodKV(this, 'multiply');
    methodKV(this, 'divide');
    methodKV(this, 'rename');
    methodKV(this, 'addToSet');
    methodKVS(this, 'pushFront');
    methodK(this, 'popFront');
    methodKVS(this, 'pushBack');
    methodK(this, 'popBack');
    methodKV(this, 'pullEQ');
    methodKV(this, 'pullGT');
    methodKV(this, 'pullGTE');
    methodKV(this, 'pullLT');
    methodKV(this, 'pullLTE');
    methodKV(this, 'pullNE');
    methodKV(this, 'pullIN');
    methodKV(this, 'pullNIN');
    methodK(this, 'get');

    Object.freeze(this);
  }
}
