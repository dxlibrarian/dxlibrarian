export async function resolvers({ database, session }) {
  const collection = await database.collection('user');

  const mongoUsers = new Map();

  const cursor = collection.find({}, { session });
  while (await cursor.hasNext()) {
    const item = await cursor.next();

    mongoUsers.set(item.id, item);
  }
}
