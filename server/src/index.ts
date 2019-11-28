import { LambdaEvent, LambdaContext } from './types';
import { wrapApiHandler } from './utils/wrapApiHandler';
import { mainHandler } from './handlers/mainHandler';

function getCustomParameters<T>(customParameters: T) {
  return customParameters;
}

export default (lambdaEvent: LambdaEvent, lambdaContext: LambdaContext) => {
  if (lambdaEvent.headers != null && lambdaEvent.httpMethod != null) {
    const executor = wrapApiHandler(mainHandler, getCustomParameters.bind(null, {}));

    return executor(lambdaEvent, lambdaContext);
  } else {
    throw new Error(`Unknown event ${JSON.stringify(lambdaEvent)}, context ${JSON.stringify(lambdaContext)}`);
  }
};
