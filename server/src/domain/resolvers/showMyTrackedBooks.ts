import { resolver } from '../../reventex/server';

import { parseUser } from '../../utils/parseUser';

import { EntityName, Resolver } from '../../constants';

export default resolver.name(Resolver.SHOW_MY_TRACKED_BOOKS).on(async ({ database, session }, args) => {
  const { jwtToken } = args;
  const { userId } = parseUser(jwtToken);

  const collection = database.collection(EntityName.BOOK);

  const projection = {
    _id: 0,
    bookId: 1,
    title: 1,
    img: 1,
    count: 1,
    author: 1,
    likes: 1,
    activeUsers: 1,
    trackers: 1
  };

  const books = await collection
    .find(
      {
        trackers: userId
      },
      { session, projection }
    )
    .toArray();

  return books;
});
