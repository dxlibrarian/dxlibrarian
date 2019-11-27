import debug from 'debug';
import util from 'util';
import chalk, { Chalk } from 'chalk';

export const logRootNamespace = 'dxlibrarian';

const logLevels: Array<[string, Chalk]> = [
  ['log', chalk.white],
  ['error', chalk.red.inverse],
  ['warn', chalk.yellow.inverse],
  ['debug', chalk.white],
  ['info', chalk.green],
  ['verbose', chalk.white]
];
const emptyFunction = Function(); // eslint-disable-line no-new-func

export function getLog(namespace: string): Log {
  let logLevel = 'info';
  if (process.env.DEBUG_LEVEL != null) {
    logLevel = process.env.DEBUG_LEVEL;
  }

  const logLevelIndex = logLevels.findIndex(([level]) => level === logLevel);
  if (logLevelIndex < 0) {
    throw new Error(`Log level ${logLevel} is not found in allowed levels`);
  }

  if (process.env.DEBUG == null) {
    debug.enable(`${logRootNamespace}:*`);
  } else {
    debug.enable(process.env.DEBUG);
  }

  const allowedLevels = logLevels.slice(0, logLevelIndex + 1).map(([levelName]) => levelName);

  const originalLogger = debug(namespace);
  const leveledLogger: { [key: string]: Function } = {};

  for (const [levelName, levelColor] of logLevels) {
    if (allowedLevels.indexOf(levelName) > -1) {
      leveledLogger[levelName] = (...args: Array<any>) => {
        originalLogger(
          `${levelColor(levelName.toUpperCase())} ${args
            .map(arg => (Object(arg) === arg ? util.inspect(arg) : arg))
            .join(' ')}`
        );
      };
    } else {
      leveledLogger[levelName] = emptyFunction;
    }
  }

  return leveledLogger as Log;
}

export type Log = {
  log: (...args: Array<any>) => void;
  error: (...args: Array<any>) => void;
  warn: (...args: Array<any>) => void;
  debug: (...args: Array<any>) => void;
  info: (...args: Array<any>) => void;
  verbose: (...args: Array<any>) => void;
};
