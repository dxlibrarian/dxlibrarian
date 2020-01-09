import Cookies from 'js-cookie';
import queryString from 'query-string';

import { API_GATEWAY_URL } from '../../constants';
import { SEARCH_BOOKS_REQUEST, SEARCH_BOOKS_SUCCESS, SEARCH_BOOKS_FAILURE, UPDATE_SEARCH_TEXT } from '../actionTypes';
import { searchBooksRequest, searchBooksSuccess, searchBooksCancel } from '../actions';

const LIVE_SEARCH_INTERVAL = 1000;

export const searchMiddleware = store => {
  let timer = null;
  let currentRequestId = 0;
  return next => async action => {
    switch (action.type) {
      case UPDATE_SEARCH_TEXT: {
        clearTimeout(timer);

        timer = setTimeout(() => {
          const {
            search: { text, searchBy, sortBy, filterBy }
          } = store.getState();

          currentRequestId++;
          store.dispatch(searchBooksRequest(text, searchBy, sortBy, filterBy, currentRequestId));
        }, LIVE_SEARCH_INTERVAL);
        break;
      }
      case SEARCH_BOOKS_REQUEST: {
        const jwtToken = Cookies.get('jwtToken');

        const { text, searchBy, sortBy, filterBy, requestId } = action.payload;

        const query = queryString.stringify({
          jwtToken,
          text: action.payload.text,
          searchBy: action.payload.searchBy,
          sortBy: action.payload.sortBy,
          filterBy: action.payload.filterBy
        });

        const response = await fetch({
          method: 'GET',
          url: `${API_GATEWAY_URL}/api/read?${query}`
        });

        const books = await response.json();

        if (requestId === currentRequestId) {
          store.dispatch(searchBooksSuccess(text, searchBy, sortBy, filterBy, requestId, books));
        } else {
          store.dispatch(searchBooksCancel(text, searchBy, sortBy, filterBy, requestId));
        }

        break;
      }
    }
    next(action);
  };
};
