import tcomb from 'tcomb-validation';

import { resolver } from '../../reventex/server';

import { validate } from '../../utils/validate';
import { parseUser } from '../../utils/parseUser';

import { EntityName, Resolver } from '../../constants';

export default resolver.name(Resolver.GET_BOOK_INFO_BY_ID).on(async ({ database, session }, args) => {
  validate(
    args,
    tcomb.struct({
      bookId: tcomb.String
    })
  );

  const { bookId, jwtToken } = args;
  parseUser(jwtToken);

  const collectionBooks = database.collection(EntityName.BOOK);
  const collectionUsers = database.collection(EntityName.USER);

  const book = await collectionBooks.findOne(
    {
      bookId
    },
    {
      session,
      projection: {
        _id: 0,
        bookId: 1,
        title: 1,
        img: 1,
        count: 1,
        author: 1,
        likes: 1,
        activeUsers: 1,
        trackers: 1
      }
    }
  );

  if (book == null) {
    const error: Error & { code?: number } = new Error(`The book with id = ${bookId} not found`);
    error.code = 404;
    throw error;
  }

  const users = await collectionUsers
    .find(
      {
        userId: { $in: Object.keys(book.activeUsers) }
      },
      {
        session,
        projection: {
          _id: 0,
          userId: 1,
          email: 1,
          name: 1
        }
      }
    )
    .toArray();

  return {
    book,
    users
  };
});
