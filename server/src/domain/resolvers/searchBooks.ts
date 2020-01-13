import tcomb from 'tcomb-validation';
import escapeStringRegexp from 'escape-string-regexp';

import { resolver } from '../../reventex/server';

import { validate } from '../../utils/validate';

import { EntityName, Resolver, SortBy, SearchBy, Location } from '../../constants';

function getQuery(params: {
  text: string;
  searchByTitle: boolean;
  searchByAuthor: boolean;
  sortBy: SortBy;
  filterBy: Location;
}) {
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
      sortBy: tcomb.enums.of([
        SortBy.TITLE_ASC,
        SortBy.TITLE_DESC,
        SortBy.AUTHOR_ASC,
        SortBy.AUTHOR_DESC,
        SortBy.LIKES_ASC,
        SortBy.LIKES_DESC
      ]),
      filterBy: tcomb.list(tcomb.enums.of([Location.TULA, Location.KALUGA, Location.SPB]))
    })
  );

  const { text, searchBy, sortBy, filterBy } = args;

  const searchByAuthor = searchBy.includes(SearchBy.AUTHOR);
  const searchByTitle = searchBy.includes(SearchBy.TITLE);

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

  const books = await collection
    .find(getQuery({ text, searchByTitle, searchByAuthor, sortBy, filterBy }), { session, projection })
    .toArray();

  return books;
});
