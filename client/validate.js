import { validate as tcombValidate } from 'tcomb-validation';

const EOL = '\n';

export function validate(value, type) {
  const result = tcombValidate(value, type);

  if (result.errors.length > 0) {
    throw new Error(result.errors.map(({ message }) => message).join(EOL));
  }
}
