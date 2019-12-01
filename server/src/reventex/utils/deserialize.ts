import { entityId } from '../entity-id';
import { TEvent } from '../event';

function unwrap(value: { t: string; v: string }): any {
  if (Array.isArray(value)) {
    return recursiveUnwrap(value);
  } else if (value === Object(value)) {
    if (value.t === 'e') {
      return entityId(value.v[0], value.v[1]);
    } else if (value.t === 'o') {
      return recursiveUnwrap(value.v);
    } else {
      throw new Error(`Incorrect value ${JSON.stringify(value)}`);
    }
  } else {
    return recursiveUnwrap(value);
  }
}

function recursiveUnwrap(source: Array<any> | { [key: string]: any } | any): any {
  if (Array.isArray(source)) {
    return source.map(value => unwrap(value));
  } else if (source === Object(source)) {
    const copyValue: { [key: string]: any } = {};
    for (let key in source) {
      if (!source.hasOwnProperty(key)) {
        continue;
      }
      copyValue[key] = unwrap(source[key]);
    }
    return copyValue;
  } else {
    return source;
  }
}

export function deserialize(eventsAsString: string): Array<TEvent> {
  const events = JSON.parse(eventsAsString);
  const eventCount = events.length;
  for (let eventIndex = 0; eventIndex < eventCount; eventIndex++) {
    const event = events[eventIndex];
    if (event.hasOwnProperty('payload')) {
      event.payload = recursiveUnwrap(event.payload);
    }
  }
  return events;
}
