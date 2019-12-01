import { connectToMongoDB } from '../connectToMongoDB';
import { Request, Response } from '../types';

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

  const client = await connectToMongoDB();
  try {
    const database = client.db();
    const events = database.collection('Events');

    res.json({
      entityName,
      documentId,
      events: await events
        .find({})
        .sort({
          'entityId.documentId': 1,
          'entityId.entityName': 1
        })
        .toArray()
    });
  } catch (error) {
    res.end(error.stack);
  } finally {
    await client.close();
  }
}
