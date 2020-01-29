import { Action, Store, Middleware, Dispatch } from 'redux';
import { PublishRequest, PublishSuccess, PublishFailure, ReadRequest, ReadSuccess, ReadFailure } from './actions';
import { TEvent } from '../event';

type TApi = {
  publish: (events: Array<TEvent>) => Promise<any>;
  read: (resolverArgs: object, resolverName: string) => Promise<any>;
};

export function createMiddleware(api: TApi): Middleware {
  return function(store: Store) {
    return function(next: Dispatch) {
      return function(action: Action) {
        if (action != null) {
          switch (action.constructor) {
            case PublishRequest: {
              const {
                payload: { events }
              } = action as PublishRequest;
              api
                .publish(events)
                .then((result: object) => store.dispatch(new PublishSuccess(events, result)))
                .catch((error: Error) => store.dispatch(new PublishFailure(events, error)));
              break;
            }
            case ReadRequest: {
              const {
                payload: { resolverArgs, resolverName }
              } = action as ReadRequest;
              api
                .read(resolverArgs, resolverName)
                .then((result: object) => store.dispatch(new ReadSuccess(resolverName, resolverArgs, result)))
                .catch((error: Error) => store.dispatch(new ReadFailure(resolverName, resolverArgs, error)));
              break;
            }
          }
        }
        return next(action);
      };
    };
  };
}
