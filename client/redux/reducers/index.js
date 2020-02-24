import { jwt } from './jwt';
import { profile } from './profile';
import { notifications } from './notifications';
import { search } from './search';
import { bookInfo } from './bookInfo';
import { myActiveBooks } from './myActiveBooks';
import { myTrackedBooks } from './myTrackedBooks';

export const reducers = {
  jwt,
  profile,
  notifications,
  search,
  bookInfo,
  myActiveBooks,
  myTrackedBooks
};
