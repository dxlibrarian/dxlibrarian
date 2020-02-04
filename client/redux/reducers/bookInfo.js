import {
  GET_BOOK_INFO_BY_ID_REQUEST,
  GET_BOOK_INFO_BY_ID_SUCCESS,
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

const initialState = {
  bookId: null,
  book: null,
  users: []
};

export const bookInfo = (state = initialState, action) => {
  switch (action.type) {
    case GET_BOOK_INFO_BY_ID_REQUEST: {
      const { bookId } = action.payload;
      return {
        bookId,
        book: null,
        users: []
      };
    }
    case GET_BOOK_INFO_BY_ID_SUCCESS: {
      const { bookId, book, users } = action.payload;
      return {
        bookId,
        book: {
          ...book,
          likesCount: book.likes.length
        },
        users
      };
    }

    case TAKE_BOOK:
    case ROLLBACK_RETURN_BOOK: {
      if (state.bookId === action.payload.bookId && state.book != null) {
        const activeUsers = { ...state.book.activeUsers };
        activeUsers[action.payload.userId] = new Date().toISOString();
        return {
          ...state,
          book: {
            ...state.book,
            activeUsers
          }
        };
      } else {
        return state;
      }
    }
    case RETURN_BOOK:
    case ROLLBACK_TAKE_BOOK: {
      if (state.bookId === action.payload.bookId && state.book != null) {
        const activeUsers = { ...state.book.activeUsers };
        delete activeUsers[action.payload.userId];
        return {
          ...state,
          book: {
            ...state.book,
            activeUsers
          }
        };
      } else {
        return state;
      }
    }

    case LIKE_BOOK:
    case ROLLBACK_DISLIKE_BOOK: {
      if (state.bookId === action.payload.bookId && state.book != null) {
        const nextState = {
          ...state,
          book: {
            ...state.book,
            likes: state.book.likes.filter(userId => userId !== action.payload.userId).concat(action.payload.userId)
          }
        };
        nextState.book.likesCount = nextState.book.likes.length;
        return nextState;
      } else {
        return state;
      }
    }
    case DISLIKE_BOOK:
    case ROLLBACK_LIKE_BOOK: {
      if (state.bookId === action.payload.bookId && state.book != null) {
        const nextState = {
          ...state,
          book: {
            ...state.book,
            likes: state.book.likes.filter(userId => userId !== action.payload.userId)
          }
        };
        nextState.book.likesCount = nextState.book.likes.length;
        return nextState;
      } else {
        return state;
      }
    }

    case TRACK_BOOK:
    case ROLLBACK_TRACK_BOOK: {
      if (state.bookId === action.payload.bookId && state.book != null) {
        return {
          ...state,
          book: {
            ...state.book,
            trackers: state.book.trackers
              .filter(userId => userId !== action.payload.userId)
              .concat(action.payload.userId)
          }
        };
      } else {
        return state;
      }
    }
    case UNTRACK_BOOK:
    case ROLLBACK_UNTRACK_BOOK: {
      if (state.bookId === action.payload.bookId && state.book != null) {
        return {
          ...state,
          book: {
            ...state.book,
            trackers: state.book.trackers.filter(userId => userId !== action.payload.userId)
          }
        };
      } else {
        return state;
      }
    }

    default: {
      return state;
    }
  }
};
