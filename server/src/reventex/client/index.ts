import { PRIVATE } from '../constants';
import { Projection } from '../projection';
import { TEvent } from '../event';
import { Middleware, Reducer } from 'redux';

type TPublishResult = object;
type TPublish = (events: Array<TEvent>) => Promise<TPublishResult>;

type TResolverResult = object;
type TRead = (resolverName: string, resolverArgs: Object) => Promise<TResolverResult>;

class Client {
  reducer: Reducer;
  middleware: Middleware;
  constructor() {
    const self = this as any;
    Object.defineProperty(self, PRIVATE, {
      value: Object.create(null)
    });
    self[PRIVATE].projections = [];
    this.reducer = (state = {}) => state;
    this.middleware = store => next => action => {
      return next(action);
    };
  }
  publish(implementation: TPublish) {
    const self = this as any;
    self[PRIVATE].publish = implementation;
    return this;
  }
  read(implementation: TRead) {
    const self = this as any;
    self[PRIVATE].read = implementation;
    return this;
  }
  projections(projections: Array<Projection>) {
    const self = this as any;
    self[PRIVATE].projections.push(...projections);
    return this;
  }
}

export const client = {
  publish(implementation: TPublish): Client {
    const instance = new Client();
    return instance.publish(implementation);
  },
  read(implementation: TRead): Client {
    const instance = new Client();
    return instance.read(implementation);
  },
  projections(projections: Array<Projection>): Client {
    const instance = new Client();
    return instance.projections(projections);
  }
};
