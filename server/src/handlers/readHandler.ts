import { Request, Response } from '../constants';

export async function readHandler(
  req: Request<
    any,
    {
      jwtToken: string;
    }
  >,
  res: Response
): Promise<void> {
  const { jwtToken } = req;
  res.json([]);
}
