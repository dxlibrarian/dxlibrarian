import { SHOW_MY_TRACKED_BOOKS_REQUEST } from '../actionTypes';
import { showMyTrackedBooksSuccess, showMyTrackedBooksFailure } from '../actions';

export const showMyTrackedBooksMiddleware = api => store => {
  return next => async action => {
    next(action);
    switch (action.type) {
      case SHOW_MY_TRACKED_BOOKS_REQUEST: {
        try {
          const books = await api.showMyTrackedBooks();
          store.dispatch(showMyTrackedBooksSuccess(books));
        } catch (error) {
          store.dispatch(showMyTrackedBooksFailure(error));
        }
        break;
      }
    }
  };
};
