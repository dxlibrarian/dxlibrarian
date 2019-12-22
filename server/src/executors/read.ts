import { createDomain } from '../domain/createDomain';
import { getLog } from '../utils/getLog';

const log = getLog('dxlibrarian:import-users');

export async function read(params: { resolverName: string; resolverArgs: { [key: string]: any } }) {
  const { resolverName, resolverArgs } = params;

  const { read, close } = createDomain();

  try {
    log.debug('Read has been started');

    log.debug('Operation "read" has been started');
    const result = await read(resolverName, resolverArgs);
    log.debug('Operation "read" has been finished');

    return result;
  } catch (error) {
    log.debug('Read has been failed');
    throw error;
  } finally {
    log.debug('Operation "close" has been started');
    await close();
    log.debug('Operation "close" has been finished');
  }
}
