import { TValue } from '../types';

export function isNonNegativeInteger(value: TValue) {
  return value == parseInt(value, 10) && value >= 0;
}
