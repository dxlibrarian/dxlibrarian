import tcomb from 'tcomb-validation';
import escapeStringRegexp from 'escape-string-regexp';

import { resolver } from '../../reventex/server';

import { validate } from '../../utils/validate';

import { EntityName, Resolver, SortBy, SearchBy, Location } from '../../constants';

function getQuery(params: { text: string; searchByTitle: boolean; searchByAuthor: boolean; filterBy: Location }) {
  const { text, searchByTitle, searchByAuthor } = params;

  const regExp = new RegExp(escapeStringRegexp(text), 'i');

  if (searchByTitle && searchByAuthor) {
    return {
      $or: [{ title: regExp }, { author: regExp }]
    };
  } else if (!searchByTitle && searchByAuthor) {
    return { author: regExp };
  } else if (searchByTitle && !searchByAuthor) {
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
      searchBy: tcomb.list(tcomb.enums.of([SearchBy.AUTHOR, SearchBy.TITLE])),
      filterBy: tcomb.list(tcomb.enums.of([Location.TULA, Location.KALUGA, Location.SPB]))
    })
  );

  const { text, searchBy, filterBy } = args;

  const searchByAuthor = searchBy.includes(SearchBy.AUTHOR);
  const searchByTitle = searchBy.includes(SearchBy.TITLE);

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
    .find(getQuery({ text, searchByTitle, searchByAuthor, filterBy }), { session, projection })
    .toArray();

  return books;
});
