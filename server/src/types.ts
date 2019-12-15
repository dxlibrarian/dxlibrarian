import { CookieSerializeOptions } from 'cookie';

export const INTERNAL = Symbol('INTERNAL');

export type HTTPMethod = 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';

export type BufferEncoding =
  | 'ascii'
  | 'utf8'
  | 'utf-8'
  | 'utf16le'
  | 'ucs2'
  | 'ucs-2'
  | 'base64'
  | 'latin1'
  | 'binary'
  | 'hex';

export enum LambdaEventType {
  IMPORT_USERS = 'IMPORT_USERS',
  BUILD_PROJECTIONS = 'BUILD_PROJECTIONS',
  DROP_PROJECTIONS = 'DROP_PROJECTIONS',
  DROP_PROJECTIONS_AND_EVENT_STORE = 'DROP_PROJECTIONS_AND_EVENT_STORE'
}

export type GatewayEvent = {
  path: string;
  httpMethod: HTTPMethod;
  headers: { [key: string]: any };
  queryStringParameters?: { [key: string]: any };
  body: string;
  type: void;
};

export type LambdaEvent =
  | {
      type: LambdaEventType.IMPORT_USERS;
    }
  | {
      type: LambdaEventType.BUILD_PROJECTIONS;
    }
  | {
      type: LambdaEventType.DROP_PROJECTIONS;
    }
  | {
      type: LambdaEventType.DROP_PROJECTIONS_AND_EVENT_STORE;
    };

export type LambdaContext = {
  [key: string]: any;
};

export interface GetCustomParameters {
  (lambdaEvent: GatewayEvent, lambdaContext: LambdaContext): Promise<{ [key: string]: any }>;
}

export type Request<Body, Query> = {
  method: HTTPMethod;
  body: Body;
  query: Query;
  path: string;
  headers: { [key: string]: any };
  cookies: { [key: string]: any };
  [key: string]: any;
};

export type Response = {
  cookie(name: string, value: string, options: CookieSerializeOptions): Response;
  clearCookie(name: string, options?: CookieSerializeOptions): Response;
  status(code: number): Response;
  redirect(path: string, code?: number): Response;
  getHeader(searchKey: string): Response;
  setHeader(key: string, value: string): Response;
  text(content: string, encoding?: BufferEncoding): Response;
  json(content: object): Response;
  end(content?: string | Buffer, encoding?: BufferEncoding): Response;
  file(content: string | Buffer, filename: string, encoding?: BufferEncoding): Response;
  [INTERNAL]: InternalResponse;
};

export type InternalResponse = {
  status: number;
  headers: { [key: string]: any };
  cookies: Array<string>;
  body: string | Buffer;
  closed: boolean;
};

export interface Handler {
  (req: Request<any, any>, res: Response): Promise<any>;
}
