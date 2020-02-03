import { GET_BOOK_INFO_BY_ID_REQUEST, GET_BOOK_INFO_BY_ID_SUCCESS } from '../actionTypes';

const initialState = {
  bookId: null,
  book: null,
  users: []
};

export const bookInfo = (state = initialState, action) => {
  switch (action.type) {
    case GET_BOOK_INFO_BY_ID_REQUEST: {
      return initialState;
    }
    case GET_BOOK_INFO_BY_ID_SUCCESS: {
      const { bookId, book, users } = action.payload;
      return {
        bookId,
        book,
        users
      };
    }
    default: {
      return state;
    }
  }
};
