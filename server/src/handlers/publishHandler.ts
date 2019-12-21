import { Request, Response } from '../constants';

export async function publishHandler(req: Request<any, any>, res: Response): Promise<void> {
  const documentVersions: Array<string> = [];

  res.json(documentVersions);
}
