import { SEARCH_BOOKS_REQUEST, UPDATE_SEARCH_TEXT, UPDATE_SEARCH_FILTER_BY, UPDATE_SEARCH_BY } from '../actionTypes';
import { searchBooksRequest, searchBooksSuccess, searchBooksCancel } from '../actions';

const LIVE_SEARCH_INTERVAL = 667;

export const searchMiddleware = api => store => {
  let timer = null;
  let currentRequestId = 0;
  return next => async action => {
    next(action);
    switch (action.type) {
      case UPDATE_SEARCH_BY:
      case UPDATE_SEARCH_FILTER_BY:
      case UPDATE_SEARCH_TEXT: {
        clearTimeout(timer);

        timer = setTimeout(() => {
          const {
            search: { text, searchBy, filterBy }
          } = store.getState();

          currentRequestId++;
          store.dispatch(searchBooksRequest(text, searchBy, filterBy, currentRequestId));
        }, LIVE_SEARCH_INTERVAL);
        break;
      }
      case SEARCH_BOOKS_REQUEST: {
        const { text, searchBy, filterBy, requestId } = action.payload;

        let books = [];

        try {
          books = await api.searchBooks({
            text,
            searchBy,
            filterBy
          });

          // TODO
          books = books.map(
            book => Array.isArray(book.activeUsers) ? book : ({
              ...book,
              activeUsers: Object.keys(book.activeUsers)
            })
          )

        } catch (error) {
          store.dispatch(searchBooksCancel(text, searchBy, filterBy, requestId));
          break;
        }

        if (requestId === currentRequestId) {
          store.dispatch(searchBooksSuccess(text, searchBy, filterBy, requestId, books));
        } else {
          store.dispatch(searchBooksCancel(text, searchBy, filterBy, requestId));
        }

        break;
      }
    }
  };
};
