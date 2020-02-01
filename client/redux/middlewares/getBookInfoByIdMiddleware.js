import { GET_BOOK_INFO_BY_ID_REQUEST } from '../actionTypes';
import { getBookInfoByIdSuccess, getBookInfoByIdFailure } from '../actions';

export const getBookInfoByIdMiddleware = api => store => {
  return next => async action => {
    next(action);
    switch (action.type) {
      case GET_BOOK_INFO_BY_ID_REQUEST: {
        const { bookId } = action.payload;

        let book = null;
        let users = [];

        try {
          ({ book, users } = await api.getBookInfoById({
            bookId
          }));
        } catch (error) {
          store.dispatch(getBookInfoByIdFailure(bookId, error));
          break;
        }

        store.dispatch(getBookInfoByIdSuccess(bookId, book, users));

        break;
      }
    }
  };
};
