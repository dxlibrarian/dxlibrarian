import { EOL } from 'os';
import { validate as tcombValidate, Type } from 'tcomb-validation';

export function validate<T>(value: any, type: Type<T>) {
  const result = tcombValidate(value, type);

  if (result.errors.length > 0) {
    throw new Error(result.errors.map(({ message }) => message).join(EOL));
  }
}
