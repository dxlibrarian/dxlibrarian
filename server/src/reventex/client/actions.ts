import { TEvent } from '../event';
import {
  PUBLISH_REQUEST,
  PUBLISH_SUCCESS,
  PUBLISH_FAILURE,
  READ_REQUEST,
  READ_SUCCESS,
  READ_FAILURE
} from './action-types';

export class PublishRequest {
  type: string;
  payload: { events: Array<TEvent> };

  constructor(events: Array<TEvent>) {
    this.type = PUBLISH_REQUEST;
    this.payload = { events };
  }
}

export class PublishSuccess {
  type: string;
  payload: { events: Array<TEvent>; result: object };

  constructor(events: Array<TEvent>, result: object) {
    this.type = PUBLISH_SUCCESS;
    this.payload = { events, result };
  }
}

export class PublishFailure {
  type: string;
  payload: { events: Array<TEvent>; error: Error };

  constructor(events: Array<TEvent>, error: Error) {
    this.type = PUBLISH_FAILURE;
    this.payload = { events, error };
  }
}

export class ReadRequest {
  type: string;
  payload: { resolverName: string; resolverArgs: object };

  constructor(resolverName: string, resolverArgs: object) {
    this.type = READ_REQUEST;
    this.payload = { resolverName, resolverArgs };
  }
}

export class ReadSuccess {
  type: string;
  payload: { resolverName: string; resolverArgs: object; result: Object };

  constructor(resolverName: string, resolverArgs: object, result: Object) {
    this.type = READ_SUCCESS;
    this.payload = { resolverName, resolverArgs, result };
  }
}

export class ReadFailure {
  type: string;
  payload: { resolverName: string; resolverArgs: object; error: Error };

  constructor(resolverName: string, resolverArgs: object, error: Error) {
    this.type = READ_FAILURE;
    this.payload = { resolverName, resolverArgs, error };
  }
}
