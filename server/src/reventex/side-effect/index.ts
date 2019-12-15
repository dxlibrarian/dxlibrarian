import { IndexOptions } from 'mongodb';

import { TEventHandler } from '../event-handler';

import { PRIVATE } from '../constants';

type Index = {
  [key: string]: 1 | -1;
};

export class SideEffect {
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

const sideEffect = {
  name(name: string) {
    const instance = new SideEffect();
    return instance.name(name);
  },
  index(keyAndIndexTypeSpecification: Index, options?: IndexOptions) {
    this[PRIVATE].indexes.push(
      options != null ? [keyAndIndexTypeSpecification, options] : [keyAndIndexTypeSpecification]
    );
  },
  on(eventType: string, eventHandler: TEventHandler) {
    const instance = new SideEffect();
    return instance.on(eventType, eventHandler);
  }
};

export { sideEffect };
