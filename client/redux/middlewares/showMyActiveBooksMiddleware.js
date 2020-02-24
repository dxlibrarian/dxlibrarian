import { SHOW_MY_ACTIVE_BOOKS_REQUEST } from '../actionTypes';
import { showMyActiveBooksSuccess, showMyActiveBooksFailure } from '../actions';

export const showMyActiveBooksMiddleware = api => store => {
  return next => async action => {
    next(action);
    switch (action.type) {
      case SHOW_MY_ACTIVE_BOOKS_REQUEST: {
        try {
          const books = await api.showMyActiveBooks();
          store.dispatch(showMyActiveBooksSuccess(books));
        } catch (error) {
          store.dispatch(showMyActiveBooksFailure(error));
        }
        break;
      }
    }
  };
};
