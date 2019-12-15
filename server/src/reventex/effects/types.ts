import { Collection, ClientSession, ObjectID } from 'mongodb';

export enum EffectType {
  SET = 'SET',
  REMOVE = 'REMOVE',
  MERGE = 'MERGE',
  SET_MAXIMUM = 'SET_MAXIMUM',
  SET_MINIMUM = 'SET_MINIMUM',
  INCREMENT = 'INCREMENT',
  DECREMENT = 'DECREMENT',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  RENAME = 'RENAME',
  ADD_TO_SET = 'ADD_TO_SET',
  PUSH_FRONT = 'PUSH_FRONT',
  POP_FRONT = 'POP_FRONT',
  PUSH_BACK = 'PUSH_BACK',
  POP_BACK = 'POP_BACK',
  PULL_EQ = 'PULL_EQ',
  PULL_GT = 'PULL_GT',
  PULL_GTE = 'PULL_GTE',
  PULL_LT = 'PULL_LT',
  PULL_LTE = 'PULL_LTE',
  PULL_NE = 'PULL_NE',
  PULL_IN = 'PULL_IN',
  PULL_NIN = 'PULL_NIN',
  GET = 'GET'
}

export type TKey = string | number | Array<string | number>;
export type TStrictKey = Array<string | number>;
export type TValue = any;

export type ImmutableContext = { state: any };
export type MongoContext = {
  session: ClientSession;
  collection: Collection;
  documentId: ObjectID;
};

export interface NormalizeArgsK {
  (args: [TKey]): [TStrictKey];
  (args: [TStrictKey]): [TStrictKey];
  (args: []): [TStrictKey];
}

export interface EffectFactoryK {
  (...args: [TKey]): Effect;
  (...args: [TStrictKey]): Effect;
  (...args: []): Effect;
}

export interface NormalizeArgsKV {
  (args: [TKey, TValue]): [TStrictKey, TValue];
  (args: [TStrictKey, TValue]): [TStrictKey, TValue];
  (args: [TValue]): [TStrictKey, TValue];
}

export interface EffectFactoryKV {
  (...args: [TKey, TValue]): Effect;
  (...args: [TStrictKey, TValue]): Effect;
  (...args: [TValue]): Effect;
}

export interface NormalizeArgsKK {
  (args: [TStrictKey, TStrictKey]): [TStrictKey, TStrictKey];
  (args: [TStrictKey, TKey]): [TStrictKey, TStrictKey];
  (args: [TKey, TStrictKey]): [TStrictKey, TStrictKey];
  (args: [TKey, TKey]): [TStrictKey, TStrictKey];
}

export interface EffectFactoryKK {
  (...args: [TStrictKey, TStrictKey]): Effect;
  (...args: [TStrictKey, TKey]): Effect;
  (...args: [TKey, TStrictKey]): Effect;
  (...args: [TKey, TKey]): Effect;
}

export interface NormalizeArgsKVS {
  (args: [TKey, TValue, number | void]): [TStrictKey, TValue, number | void];
  (args: [TStrictKey, TValue, number | void]): [TStrictKey, TValue, number | void];
  (args: [TValue]): [TStrictKey, TValue, number | void];
}

export interface EffectFactoryKVS {
  (...args: [TKey, TValue, number | void]): Effect;
  (...args: [TStrictKey, TValue, number | void]): Effect;
  (...args: [TValue]): Effect;
}

export type EffectFactory = {
  set: EffectFactoryKV;
  remove: EffectFactoryK;
  merge: EffectFactoryKV;
  setMaximum: EffectFactoryKV;
  setMinimum: EffectFactoryKV;
  increment: EffectFactoryKV;
  decrement: EffectFactoryKV;
  multiply: EffectFactoryKV;
  divide: EffectFactoryKV;
  rename: EffectFactoryKK;
  addToSet: EffectFactoryKV;
  pushFront: EffectFactoryKVS;
  popFront: EffectFactoryK;
  pushBack: EffectFactoryKVS;
  popBack: EffectFactoryK;
  pullEQ: EffectFactoryKV;
  pullGT: EffectFactoryKV;
  pullGTE: EffectFactoryKV;
  pullLT: EffectFactoryKV;
  pullLTE: EffectFactoryKV;
  pullNE: EffectFactoryKV;
  pullIN: EffectFactoryKV;
  pullNIN: EffectFactoryKV;
  get: EffectFactoryK;
};

export type Effect = {
  key: TStrictKey;
  value: TValue;
  sliceSize?: number | void;
  type: EffectType;
};
