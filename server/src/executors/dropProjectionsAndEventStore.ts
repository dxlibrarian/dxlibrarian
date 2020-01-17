import { createDomain } from '../domain/createDomain';
import { getLog } from '../utils/getLog';

const log = getLog('dxlibrarian:drop-projections-and-event-store');

export async function dropProjectionsAndEventStore() {
  const { drop, close } = createDomain();

  try {
    log.debug('Executor "dropProjectionsAndEventStore" has been started');
    await drop({ eventStore: true });
    log.debug('Executor "dropProjectionsAndEventStore" has been finished');
  } catch (error) {
    log.debug('Executor "dropProjectionsAndEventStore" has been failed');
    throw error;
  } finally {
    log.debug('Operation "close" has been started');
    await close();
    log.debug('Operation "close" has been finished');
  }
}
