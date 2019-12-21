import binaryCase from 'binary-case';
import contentDisposition from 'content-disposition';
import cookie, { CookieSerializeOptions } from 'cookie';

import {
  Response,
  Request,
  LambdaContext,
  GatewayEvent,
  InternalResponse,
  BufferEncoding,
  GetCustomParameters,
  Handler,
  INTERNAL
} from '../constants';

const COOKIE_CLEAR_DATE = new Date(0);

function normalizeKey(key: string, mode: string): string {
  switch (mode) {
    case 'upper-dash-case':
      return key
        .toLowerCase()
        .split(/-/g)
        .map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join('-');
    case 'dash-case':
      return `${key.charAt(0).toUpperCase()}${key.slice(1).toLowerCase()}`;
    case 'lower-case':
      return key.toLowerCase();
    default:
      throw new Error(`Wrong normalize mode ${mode}`);
  }
}

function wrapHeadersCaseInsensitive(headersMap: { [key: string]: any }) {
  return Object.create(
    Object.prototype,
    Object.keys(headersMap).reduce(function(acc: PropertyDescriptorMap, key: string): PropertyDescriptorMap {
      const value = headersMap[key];
      const [upperDashKey, dashKey, lowerKey] = [
        normalizeKey(key, 'upper-dash-case'),
        normalizeKey(key, 'dash-case'),
        normalizeKey(key, 'lower-case')
      ];

      acc[upperDashKey] = { value, enumerable: true };
      if (upperDashKey !== dashKey) {
        acc[dashKey] = { value, enumerable: false };
      }
      acc[lowerKey] = { value, enumerable: false };

      return acc;
    }, {})
  );
}

async function createRequest(
  lambdaEvent: GatewayEvent,
  customParameters?: { [key: string]: any }
): Promise<Request<string, any>> {
  /* eslint-disable prefer-const */
  let {
    path,
    httpMethod,
    headers: { 'x-proxy-headers': proxyHeadersString, ...originalHeaders },
    queryStringParameters,
    body
  } = lambdaEvent;
  /* eslint-enable prefer-const */

  if (proxyHeadersString != null) {
    for (const [headerName, headerValue] of Object.entries(JSON.parse(proxyHeadersString))) {
      const normalizedHeaderName = normalizeKey(headerName, 'upper-dash-case');
      if (headerName.toLowerCase() === 'x-uri') {
        path = `${headerValue}`;
      } else {
        for (const originalHeaderName of Object.keys(originalHeaders)) {
          if (normalizeKey(originalHeaderName, 'upper-dash-case') === normalizedHeaderName) {
            delete originalHeaders[originalHeaderName];
          }
        }

        originalHeaders[normalizedHeaderName] = headerValue;
      }
    }
  }

  const headers = wrapHeadersCaseInsensitive(originalHeaders);
  const cookies = headers.cookie != null && headers.cookie.constructor === String ? cookie.parse(headers.cookie) : {};

  const req: Request<string, any> = Object.create(null);

  const query = queryStringParameters != null ? queryStringParameters : {};

  const reqProperties: Request<string, any> = {
    method: httpMethod,
    query,
    path,
    headers,
    cookies,
    body,
    ...customParameters
  };

  for (const name of Object.keys(reqProperties)) {
    Object.defineProperty(req, name, {
      enumerable: true,
      get: function(): any {
        return reqProperties[name];
      },
      set: function() {
        throw new Error(`Request parameters can't be modified`);
      }
    });
  }

  Object.freeze(req);

  return req;
}

function createResponse(): Response {
  const internalRes: InternalResponse = {
    status: 200,
    headers: {},
    cookies: [],
    body: '',
    closed: false
  };

  function validateResponseOpened() {
    if (internalRes.closed) {
      throw new Error('Response already sent');
    }
  }

  function validateOptionShape(fieldName: string, option: any, types: Array<any>, nullable = false): void {
    const isValidValue =
      (nullable && option == null) ||
      !(
        option == null ||
        !types.reduce(function(acc, type) {
          return acc || option.constructor === type;
        }, false)
      );
    if (!isValidValue) {
      throw new Error(`Variable "${fieldName}" should be one of following types: ${types.join(', ')}`);
    }
  }

  const res = Object.create(null, { [INTERNAL]: { value: internalRes } });

  function defineResponseMethod(name: string, value: any): void {
    Object.defineProperty(res, name, {
      enumerable: true,
      value
    });
  }

  defineResponseMethod('cookie', function(name: string, value: string, options: CookieSerializeOptions) {
    validateResponseOpened();
    const serializedCookie = cookie.serialize(name, value, options);

    internalRes.cookies.push(serializedCookie);
    return res;
  });

  defineResponseMethod('clearCookie', function(name: string, options: CookieSerializeOptions) {
    validateResponseOpened();
    const serializedCookie = cookie.serialize(name, '', {
      ...options,
      expires: COOKIE_CLEAR_DATE
    });

    internalRes.cookies.push(serializedCookie);
    return res;
  });

  defineResponseMethod('status', function(code: number) {
    validateResponseOpened();
    validateOptionShape('Status code', code, [Number]);
    internalRes.status = code;
    return res;
  });

  defineResponseMethod('redirect', function(path: string, code?: number) {
    validateResponseOpened();
    validateOptionShape('Status code', code, [Number], true);
    validateOptionShape('Location path', path, [String]);
    internalRes.headers['Location'] = path;
    internalRes.status = code != null ? code : 302;

    internalRes.closed = true;
    return res;
  });

  defineResponseMethod('getHeader', function(searchKey: string) {
    validateOptionShape('Header name', searchKey, [String]);
    const normalizedKey = normalizeKey(searchKey, 'upper-dash-case');
    return internalRes.headers[normalizedKey];
  });

  defineResponseMethod('setHeader', function(key: string, value: string) {
    validateResponseOpened();
    validateOptionShape('Header name', key, [String]);
    validateOptionShape('Header value', value, [String]);

    internalRes.headers[normalizeKey(key, 'upper-dash-case')] = value;
    return res;
  });

  defineResponseMethod('text', function(content: string, encoding: BufferEncoding) {
    validateResponseOpened();
    validateOptionShape('Text', content, [String]);
    validateOptionShape('Encoding', encoding, [String], true);
    internalRes.body = Buffer.from(content, encoding);
    internalRes.closed = true;
    return res;
  });

  defineResponseMethod('json', function(content: string | Buffer) {
    validateResponseOpened();
    internalRes.headers[normalizeKey('Content-Type', 'upper-dash-case')] = 'application/json';
    internalRes.body = JSON.stringify(content);
    internalRes.closed = true;
    return res;
  });

  defineResponseMethod('end', function(content: string | Buffer = '', encoding: BufferEncoding) {
    validateResponseOpened();
    validateOptionShape('Content', content, [String, Buffer]);
    validateOptionShape('Encoding', encoding, [String], true);
    internalRes.body = content.constructor === String ? Buffer.from(content as string, encoding) : content;

    internalRes.closed = true;
    return res;
  });

  defineResponseMethod('file', function(content: string | Buffer, filename: string, encoding: BufferEncoding) {
    validateResponseOpened();
    validateOptionShape('Content', content, [String, Buffer]);
    validateOptionShape('Encoding', encoding, [String], true);
    internalRes.body = content.constructor === String ? Buffer.from(content as string, encoding) : content;

    internalRes.headers['Content-Disposition'] = contentDisposition(filename);

    internalRes.closed = true;
    return res;
  });

  Object.freeze(res);

  return res;
}

export const wrapApiHandler = (handler: Handler, getCustomParameters: GetCustomParameters) => async (
  lambdaEvent: GatewayEvent,
  lambdaContext: LambdaContext
) => {
  let result;
  try {
    const customParameters =
      typeof getCustomParameters === 'function' ? await getCustomParameters(lambdaEvent, lambdaContext) : {};

    const req = await createRequest(lambdaEvent, customParameters);
    const res = createResponse();

    await handler(req, res);

    const internalResponse: InternalResponse = res[INTERNAL];
    const { status: statusCode, headers, cookies, body: bodyBuffer } = internalResponse;
    const body = bodyBuffer.toString();

    for (let idx = 0; idx < cookies.length; idx++) {
      headers[binaryCase('Set-cookie', idx)] = cookies[idx];
    }

    result = { statusCode, headers, body };
  } catch (error) {
    const outError = error != null && error.stack != null ? `${error.stack}` : `Unknown error ${error}`;

    // eslint-disable-next-line no-console
    console.error(outError);

    result = {
      statusCode: 500,
      body: ''
    };
  }

  return result;
};
