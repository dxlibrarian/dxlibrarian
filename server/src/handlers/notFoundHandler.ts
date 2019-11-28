import { Request, Response } from '../types';

export async function notFoundHandler(req: Request<any, any>, res: Response): Promise<void> {
  res.status(404);
  res.end(`Route not found error "${req.path}"`);
}
