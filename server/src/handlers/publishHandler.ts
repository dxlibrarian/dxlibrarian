import { Request, Response } from '../constants';
import { createDomain } from '../domain/createDomain';
import { deserialize } from '../reventex/server';

export async function publishHandler(req: Request<any, any>, res: Response): Promise<void> {
  const serializedEvents = req.body.events;

  const events = deserialize(serializedEvents);

  const { publish, close } = createDomain();
  try {
    await publish(events);
    res.json({ ok: true });
  } finally {
    await close();
  }
}
