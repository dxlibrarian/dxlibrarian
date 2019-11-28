import { Request, Response } from './types';

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
  const { entityName, documentId } = req.query;

  res.json({
    entityName,
    documentId
  });
}
