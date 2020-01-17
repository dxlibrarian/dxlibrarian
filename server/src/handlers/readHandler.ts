import { Request, Response } from '../constants';
import { createDomain } from '../domain/createDomain';
import { Resolver } from '../constants';

const allResolverNames: Array<string> = Object.values(Resolver);

export async function readHandler(
  req: Request<
    any,
    {
      jwtToken: string;
      resolverName: string;
      [key: string]: any;
    }
  >,
  res: Response
): Promise<void> {
  const { resolverName = 'unknown', ...resolverArgs } = req.query;
  const { jwtToken } = req;
  resolverArgs.jwtToken = jwtToken;

  if (!allResolverNames.includes(resolverName)) {
    const error: Error & { code?: number } = new Error();
    error.code = 404;
    error.message = `Resolver name "${resolverName}" not found`;
    throw error;
  }

  const { read, close } = createDomain();
  try {
    const result = await read(resolverName, resolverArgs);
    res.json(result);
  } finally {
    await close();
  }
}
