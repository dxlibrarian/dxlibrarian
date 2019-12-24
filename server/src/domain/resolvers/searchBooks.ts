import tcomb from 'tcomb-validation';
import escapeStringRegexp from 'escape-string-regexp';

import { resolver } from '../../reventex/server';

import { validate } from '../../utils/validate';

import { EntityName, Resolver } from '../../constants';

function getQuery(params: { text: string; title: boolean; author: boolean }) {
  const { text, title, author } = params;

  const regExp = new RegExp(escapeStringRegexp(text), 'i');

  if (title && author) {
    return {
      $or: [{ title: regExp }, { author: regExp }]
    };
  } else if (!title && author) {
    return { author: regExp };
  } else if (title && !author) {
    return { title: regExp };
  } else {
    return {};
  }
}

export default resolver.name(Resolver.SEARCH_BOOKS).on(async ({ database, session }, args) => {
  validate(
    args,
    tcomb.struct({
      text: tcomb.String,
      title: tcomb.Boolean,
      author: tcomb.Boolean
    })
  );

  const { text, title, author } = args;

  const collection = database.collection(EntityName.BOOK);

  const projection = {
    bookId: 1,
    title: 1,
    img: 1,
    count: 1,
    activeUsers: 1,
    author: 1,
    likes: 1
  };

  const books = await collection.find(getQuery({ text, title, author }), { session, projection }).toArray();

  return books;
});
