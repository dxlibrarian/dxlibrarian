import { normalizeArgsK, normalizeArgsKV, normalizeArgsKK, normalizeArgsKVS } from './normalize';
import { Effect, EffectType, EffectFactory } from './types';

function set(...args: any): Effect {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.SET
  };
}

function remove(...args: any): Effect {
  const [key] = normalizeArgsK(args);
  return {
    key,
    value: undefined,
    type: EffectType.REMOVE
  };
}

function merge(...args: any): Effect {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.MERGE
  };
}

function setMaximum(...args: any): Effect {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.SET_MAXIMUM
  };
}

function setMinimum(...args: any): Effect {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.SET_MINIMUM
  };
}

function increment(...args: any): Effect {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.INCREMENT
  };
}

function decrement(...args: any): Effect {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.DECREMENT
  };
}

function multiply(...args: any): Effect {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.MULTIPLY
  };
}

function divide(...args: any): Effect {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.DIVIDE
  };
}

function rename(...args: any): Effect {
  const [key, newKey] = normalizeArgsKK(args);
  return {
    key,
    value: newKey,
    type: EffectType.RENAME
  };
}

function addToSet(...args: any): Effect {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.ADD_TO_SET
  };
}

function pushFront(...args: any): Effect {
  const [key, value, sliceSize] = normalizeArgsKVS(args);
  return {
    key,
    value,
    sliceSize,
    type: EffectType.PUSH_FRONT
  };
}

function popFront(...args: any): Effect {
  const [key] = normalizeArgsK(args);
  return {
    key,
    value: undefined,
    type: EffectType.POP_FRONT
  };
}

function pushBack(...args: any): Effect {
  const [key, value, sliceSize] = normalizeArgsKVS(args);
  return {
    key,
    value,
    sliceSize,
    type: EffectType.PUSH_BACK
  };
}

function popBack(...args: any): Effect {
  const [key] = normalizeArgsK(args);
  return {
    key,
    value: undefined,
    type: EffectType.POP_BACK
  };
}

function pullEQ(...args: any): Effect {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.PULL_EQ
  };
}

function pullGT(...args: any): Effect {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.PULL_GT
  };
}

function pullGTE(...args: any): Effect {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.PULL_GTE
  };
}

function pullLT(...args: any): Effect {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.PULL_LT
  };
}

function pullLTE(...args: any): Effect {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.PULL_LTE
  };
}

function pullNE(...args: any): Effect {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.PULL_NE
  };
}

function pullIN(...args: any): Effect {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.PULL_IN
  };
}

function pullNIN(...args: any): Effect {
  const [key, value] = normalizeArgsKV(args);
  return {
    key,
    value,
    type: EffectType.PULL_NIN
  };
}

function get(...args: any): Effect {
  const [key] = normalizeArgsK(args);
  return {
    key,
    value: undefined,
    type: EffectType.GET
  };
}

export const effectFactory: EffectFactory = {
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
