const regExpMinus = /-/g;

export function prepareOID(oid: string) {
  return oid.replace(regExpMinus, '').slice(0, 24);
}
