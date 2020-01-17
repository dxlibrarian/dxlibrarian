import { createDomain } from '../domain/createDomain';
import { getLog } from '../utils/getLog';

const log = getLog('dxlibrarian:build-projections');

export async function buildProjections() {
  const { build, close } = createDomain();

  try {
    log.debug('Executor "buildProjections" has been started');
    await build();
    log.debug('Executor "buildProjections" has been finished');
  } catch (error) {
    log.debug('Executor "buildProjections" has been failed');
    throw error;
  } finally {
    log.debug('Operation "close" has been started');
    await close();
    log.debug('Operation "close" has been finished');
  }
}
