import { Request, Response } from '../constants';

export async function readHandler(
  req: Request<
    any,
    {
      entityName: string;
      documentId: string;
    }
  >,
  res: Response
): Promise<void> {
  res.end('ok');
}
