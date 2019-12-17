import { Db, ClientSession } from 'mongodb';

import { PRIVATE } from '../constants';

type Reader = (client: { database: Db; session: ClientSession }, args: { [key: string]: any }) => Promise<any>;

export class Resolver {
  [PRIVATE]: {
    name: string;
    on: Reader;
  };

  constructor() {
    Object.defineProperty(this, PRIVATE, {
      value: Object.create(null)
    });
    this.read = this.read.bind(this);
  }

  name(name: string) {
    if (this[PRIVATE].name != null) {
      throw new Error(`The name "${name}" already exists`);
    }
    this[PRIVATE].name = name;
    return this;
  }

  on(on: Reader) {
    if (this[PRIVATE].on != null) {
      throw new Error(`Reader already exists`);
    }
    this[PRIVATE].on = on;
    return this;
  }

  read(client: { database: Db; session: ClientSession }, args: { [key: string]: any }): Promise<any> {
    return this[PRIVATE].on(client, args);
  }
}

export const resolver = {
  name(name: string) {
    const instance = new Resolver();
    return instance.name(name);
  },
  on(on: Reader) {
    const instance = new Resolver();
    return instance.on(on);
  }
};
