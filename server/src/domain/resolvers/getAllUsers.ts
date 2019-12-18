import { resolver } from '../../reventex/server';

import { EntityName, Resolver } from '../../constants';

export default resolver.name(Resolver.GET_ALL_USERS).on(async ({ database, session }) => {
  const collection = await database.collection(EntityName.USER);

  const mongoUsers = new Map();

  const cursor = collection.find({}, { session });
  while (await cursor.hasNext()) {
    const item = await cursor.next();

    mongoUsers.set(item.id, item);
  }

  return mongoUsers;
});
