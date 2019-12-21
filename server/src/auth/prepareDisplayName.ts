import { postfixes } from './postfixes';

export function prepareDisplayName(displayName: string) {
  let name = displayName;
  for (const postfix of postfixes) {
    name = name.replace(postfix, '');
  }
  name = name.trim();
  return name;
}
