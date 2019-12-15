import { TValue } from '../types';

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
