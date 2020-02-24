import {
  SHOW_MY_ACTIVE_BOOKS_SUCCESS,
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
import { getNextBooks } from '../helpers/getNextBooks';

const initialState = {
  books: []
};

export const myActiveBooks = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MY_ACTIVE_BOOKS_SUCCESS: {
      return {
        ...state,
        books: action.payload.books.map(book => ({ ...book, likesCount: book.likes.length }))
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
