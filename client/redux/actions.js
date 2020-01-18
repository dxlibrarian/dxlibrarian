import {
  NOOP,
  LOGIN,
  AUTHORIZE,
  SEARCH_BOOKS_REQUEST,
  SEARCH_BOOKS_SUCCESS,
  SEARCH_BOOKS_FAILURE,
  SEARCH_BOOKS_CANCEL,
  UPDATE_SEARCH_TEXT,
  UPDATE_SEARCH_BY,
  UPDATE_SEARCH_SORT_BY,
  UPDATE_SEARCH_FILTER_BY,
  UPDATE_SEARCH_DISPLAY_MODE
} from './actionTypes';

export const noop = () => ({
  type: NOOP,
  payload: {}
});

export const login = (jwtToken, settings) => ({
  type: LOGIN,
  payload: {
    jwtToken,
    settings
  }
});

export const authorize = (jwtToken, settings) => ({
  type: AUTHORIZE,
  payload: {
    jwtToken,
    settings
  }
});

export const searchBooksRequest = (text, searchBy, filterBy, requestId) => ({
  type: SEARCH_BOOKS_REQUEST,
  payload: {
    text,
    searchBy,
    filterBy,
    requestId
  }
});

export const searchBooksSuccess = (text, searchBy, filterBy, requestId, books) => ({
  type: SEARCH_BOOKS_SUCCESS,
  payload: {
    text,
    searchBy,
    filterBy,
    requestId,
    books
  }
});

export const searchBooksFailure = (text, searchBy, filterBy, requestId, error) => ({
  type: SEARCH_BOOKS_FAILURE,
  payload: {
    text,
    searchBy,
    filterBy,
    requestId
  },
  error
});

export const searchBooksCancel = (text, searchBy, sortBy, filterBy, requestId) => ({
  type: SEARCH_BOOKS_CANCEL,
  payload: {
    text,
    searchBy,
    filterBy,
    requestId
  }
});

export const updateSearchText = text => ({
  type: UPDATE_SEARCH_TEXT,
  payload: {
    text
  }
});

export const updateSearchBy = searchBy => ({
  type: UPDATE_SEARCH_BY,
  payload: {
    searchBy
  }
});

export const updateSortBy = sortBy => ({
  type: UPDATE_SEARCH_SORT_BY,
  payload: {
    sortBy
  }
});

export const updateSearchFilterBy = filterBy => ({
  type: UPDATE_SEARCH_FILTER_BY,
  payload: {
    filterBy
  }
});

export const updateSearchDisplayMode = displayMode => ({
  type: UPDATE_SEARCH_DISPLAY_MODE,
  payload: {
    displayMode
  }
});
