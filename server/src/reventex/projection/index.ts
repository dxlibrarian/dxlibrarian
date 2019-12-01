import { IndexOptions } from 'mongodb';

import { TEventHandler } from '../event-handler';
import { PRIVATE } from '../constants';

type Index = {
  [key: string]: 1 | -1;
};

export class Projection {
  [PRIVATE]: {
    name: string;
    indexes: Array<[Index] | [Index, IndexOptions]>;
    eventHandlers: {
      [key: string]: TEventHandler;
    };
  };

  constructor() {
    Object.defineProperty(this, PRIVATE, {
      value: Object.create(null)
    });
    this[PRIVATE].eventHandlers = {};
    this[PRIVATE].indexes = [];
  }
  name(name: string) {
    if (this[PRIVATE].name != null) {
      throw new Error(`Name already exists`);
    }
    this[PRIVATE].name = name;
    return this;
  }
  index(keyAndIndexTypeSpecification: Index, options?: IndexOptions) {
    this[PRIVATE].indexes.push(
      options != null ? [keyAndIndexTypeSpecification, options] : [keyAndIndexTypeSpecification]
    );
  }
  on(eventType: string, eventHandler: TEventHandler) {
    if (this[PRIVATE].eventHandlers[eventType] != null) {
      throw new Error(`Event handler "${eventType}" already exists`);
    }
    this[PRIVATE].eventHandlers[eventType] = eventHandler;
    return this;
  }
}

const projection = {
  name(name: string) {
    const instance = new Projection();
    return instance.name(name);
  },
  index(keyAndIndexTypeSpecification: Index, options?: IndexOptions) {
    const instance = new Projection();
    return instance.index(keyAndIndexTypeSpecification, options);
  },
  on(eventType: string, eventHandler: TEventHandler) {
    const instance = new Projection();
    return instance.on(eventType, eventHandler);
  }
};

export { projection };
