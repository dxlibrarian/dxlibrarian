import { SearchBy, SortBy, Location, DisplayMode } from '../../constants';
import {
  UPDATE_SEARCH_TEXT,
  UPDATE_SEARCH_BY,
  UPDATE_SEARCH_SORT_BY,
  UPDATE_SEARCH_FILTER_BY,
  UPDATE_SEARCH_DISPLAY_MODE,
  SEARCH_BOOKS_SUCCESS,
  AUTHORIZE,
  LOGIN,
  TAKE_BOOK,
  ROLLBACK_TAKE_BOOK,
  RETURN_BOOK,
  ROLLBACK_RETURN_BOOK,
  TRACK_BOOK,
  ROLLBACK_TRACK_BOOK,
  UNTRACK_BOOK,
  ROLLBACK_UNTRACK_BOOK,
  LIKE_BOOK,
  ROLLBACK_LIKE_BOOK,
  DISLIKE_BOOK,
  ROLLBACK_DISLIKE_BOOK
} from '../actionTypes';

const sortFunctions = {
  [SortBy.TITLE_ASC]: (a, b) => (a.title > b.title ? 1 : a.title < b.title ? -1 : 0),
  [SortBy.TITLE_DESC]: (a, b) => (a.title > b.title ? -1 : a.title < b.title ? 1 : 0),
  [SortBy.AUTHOR_ASC]: (a, b) => (a.author > b.author ? 1 : a.author < b.author ? -1 : 0),
  [SortBy.AUTHOR_DESC]: (a, b) => (a.author > b.author ? -1 : a.author < b.author ? 1 : 0),
  [SortBy.LIKES_ASC]: (a, b) => (a.likesCount > b.likesCount ? 1 : a.likesCount < b.likesCount ? -1 : 0),
  [SortBy.LIKES_DESC]: (a, b) => (a.likesCount > b.likesCount ? -1 : a.likesCount < b.likesCount ? 1 : 0)
};

const getNextBooks = (books, bookId, updater, upsert) => {
  const nextBooks = books.concat([]);
  const countBooks = books.length;

  for (let bookIndex = 0; bookIndex < countBooks; bookIndex++) {
    const book = nextBooks[bookIndex];
    if (book.bookId === bookId) {
      nextBooks[bookIndex] = updater(book);
      return nextBooks;
    }
  }

  if (upsert) {
    return nextBooks.concat(updater());
  } else {
    return nextBooks;
  }
};

const initialState = {
  books: [],
  text: '',
  searchBy: [SearchBy.TITLE, SearchBy.AUTHOR],
  sortBy: SortBy.TITLE_ASC,
  filterBy: [Location.TULA, Location.KALUGA, Location.SPB],
  displayMode: DisplayMode.STANDARD
};

export const search = (state = initialState, action) => {
  switch (action.type) {
    case AUTHORIZE:
    case LOGIN: {
      return {
        ...state,
        ...action.payload.settings
      };
    }
    case UPDATE_SEARCH_TEXT: {
      return {
        ...state,
        text: action.payload.text
      };
    }
    case UPDATE_SEARCH_BY: {
      return {
        ...state,
        searchBy: action.payload.searchBy
      };
    }
    case UPDATE_SEARCH_FILTER_BY: {
      return {
        ...state,
        filterBy: action.payload.filterBy
      };
    }
    case UPDATE_SEARCH_DISPLAY_MODE: {
      return {
        ...state,
        displayMode: action.payload.displayMode
      };
    }
    case UPDATE_SEARCH_SORT_BY: {
      return {
        ...state,
        books: state.books.sort(sortFunctions[action.payload.sortBy]),
        sortBy: action.payload.sortBy
      };
    }
    case SEARCH_BOOKS_SUCCESS: {
      return {
        ...state,
        books: action.payload.books
          .map(book => ({ ...book, likesCount: book.likes.length }))
          .sort(sortFunctions[state.sortBy])
      };
    }

    case TAKE_BOOK:
    case ROLLBACK_RETURN_BOOK: {
      return {
        ...state,
        books: getNextBooks(state.books, action.payload.bookId, book => {
          const activeUsers = { ...book.activeUsers };
          activeUsers[action.payload.userId] = new Date().toISOString();
          return {
            ...book,
            activeUsers
          };
        })
      };
    }
    case RETURN_BOOK:
    case ROLLBACK_TAKE_BOOK: {
      return {
        ...state,
        books: getNextBooks(state.books, action.payload.bookId, book => {
          const activeUsers = { ...book.activeUsers };
          delete activeUsers[action.payload.userId];
          return {
            ...book,
            activeUsers
          };
        })
      };
    }

    case LIKE_BOOK:
    case ROLLBACK_DISLIKE_BOOK: {
      return {
        ...state,
        books: getNextBooks(state.books, action.payload.bookId, book => {
          const nextBook = {
            ...book,
            likes: book.likes.filter(userId => userId !== action.payload.userId).concat(action.payload.userId)
          };
          nextBook.likesCount = nextBook.likes.length;
          return nextBook;
        })
      };
    }
    case DISLIKE_BOOK:
    case ROLLBACK_LIKE_BOOK: {
      return {
        ...state,
        books: getNextBooks(state.books, action.payload.bookId, book => {
          const nextBook = {
            ...book,
            likes: book.likes.filter(userId => userId !== action.payload.userId)
          };
          nextBook.likesCount = nextBook.likes.length;
          return nextBook;
        })
      };
    }

    case TRACK_BOOK:
    case ROLLBACK_TRACK_BOOK: {
      return {
        ...state,
        books: getNextBooks(state.books, action.payload.bookId, book => ({
          ...book,
          trackers: book.trackers.filter(userId => userId !== action.payload.userId).concat(action.payload.userId)
        }))
      };
    }
    case UNTRACK_BOOK:
    case ROLLBACK_UNTRACK_BOOK: {
      return {
        ...state,
        books: getNextBooks(state.books, action.payload.bookId, book => ({
          ...book,
          trackers: book.trackers.filter(userId => userId !== action.payload.userId)
        }))
      };
    }

    default: {
      return state;
    }
  }
};
