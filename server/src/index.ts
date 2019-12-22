import { GatewayEvent, LambdaContext, LambdaEvent, LambdaEventType } from './constants';
import { wrapApiHandler } from './utils/wrapApiHandler';
import { mainHandler } from './handlers/mainHandler';
import { importUsers } from './executors/importUsers';
import { dropProjections } from './executors/dropProjections';
import { dropProjectionsAndEventStore } from './executors/dropProjectionsAndEventStore';
import { buildProjections } from './executors/buildProjections';
import { createBook } from './executors/createBook';
import { read } from './executors/read';

function getCustomParameters<T>(customParameters: T) {
  return customParameters;
}

export default (event: any, context: LambdaContext) => {
  const gatewayEvent = event as GatewayEvent;
  if (gatewayEvent.headers != null && gatewayEvent.httpMethod != null) {
    const executor = wrapApiHandler(mainHandler, getCustomParameters.bind(null, {}));

    return executor(gatewayEvent, context);
  }

  const lambdaEvent = event as LambdaEvent;
  switch (lambdaEvent.type) {
    case LambdaEventType.IMPORT_USERS: {
      return importUsers();
    }
    case LambdaEventType.DROP_PROJECTIONS: {
      return dropProjections();
    }
    case LambdaEventType.DROP_PROJECTIONS_AND_EVENT_STORE: {
      return dropProjectionsAndEventStore();
    }
    case LambdaEventType.BUILD_PROJECTIONS: {
      return buildProjections();
    }
    case LambdaEventType.CREATE_BOOK: {
      return createBook(event.payload);
    }
    case LambdaEventType.READ: {
      return read(event.payload);
    }
    default: {
      throw new Error(`Unknown event ${JSON.stringify(event)}, context ${JSON.stringify(context)}`);
    }
  }
};
