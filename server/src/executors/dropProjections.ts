import { createDomain } from '../domain/createDomain';
import { getLog } from '../utils/getLog';

const log = getLog('dxlibrarian:drop-projections');

export async function dropProjections() {
  const { drop, close } = createDomain();

  try {
    log.debug('Drop projections has been started');
    await drop();
    log.debug('Drop projections has been finished');
  } catch (error) {
    log.debug('Drop projections has been failed');
    throw error;
  } finally {
    log.debug('Operation "close" has been started');
    await close();
    log.debug('Operation "close" has been finished');
  }
}
