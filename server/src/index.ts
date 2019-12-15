import { GatewayEvent, LambdaContext, LambdaEvent, LambdaEventType } from './types';
import { wrapApiHandler } from './utils/wrapApiHandler';
import { mainHandler } from './handlers/mainHandler';
import { importUsers } from './import-users';

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
    default: {
      throw new Error(`Unknown event ${JSON.stringify(event)}, context ${JSON.stringify(context)}`);
    }
  }
};
