import { resolver } from '../../reventex/server';

import { EntityName, Resolver } from '../../constants';
import { DXLibrarianUser } from '../../constants';

export default resolver.name(Resolver.GET_ALL_USERS_GROUP_BY_USER_ID).on(async ({ database, session }) => {
  const collection = database.collection(EntityName.USER);

  const mongoUsers = new Map();

  const cursor = collection.find({}, { session });
  while (await cursor.hasNext()) {
    const item: DXLibrarianUser = await cursor.next();

    mongoUsers.set(item.userId, item);
  }

  return mongoUsers;
});
