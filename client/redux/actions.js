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
  UPDATE_SEARCH_DISPLAY_MODE,
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
  ROLLBACK_DISLIKE_BOOK,
  GET_BOOK_INFO_BY_ID_REQUEST,
  GET_BOOK_INFO_BY_ID_SUCCESS,
  GET_BOOK_INFO_BY_ID_FAILURE,
  SHOW_MY_ACTIVE_BOOKS_REQUEST,
  SHOW_MY_ACTIVE_BOOKS_SUCCESS,
  SHOW_MY_ACTIVE_BOOKS_FAILURE,
  SHOW_MY_TRACKED_BOOKS_REQUEST,
  SHOW_MY_TRACKED_BOOKS_SUCCESS,
  SHOW_MY_TRACKED_BOOKS_FAILURE
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

export const showMyActiveBooksRequest = () => ({
  type: SHOW_MY_ACTIVE_BOOKS_REQUEST,
  payload: {}
});

export const showMyActiveBooksSuccess = books => ({
  type: SHOW_MY_ACTIVE_BOOKS_SUCCESS,
  payload: {
    books
  }
});

export const showMyActiveBooksFailure = error => ({
  type: SHOW_MY_ACTIVE_BOOKS_FAILURE,
  payload: {},
  error
});

export const showMyTrackedBooksRequest = () => ({
  type: SHOW_MY_TRACKED_BOOKS_REQUEST,
  payload: {}
});

export const showMyTrackedBooksSuccess = books => ({
  type: SHOW_MY_TRACKED_BOOKS_SUCCESS,
  payload: {
    books
  }
});

export const showMyTrackedBooksFailure = error => ({
  type: SHOW_MY_TRACKED_BOOKS_FAILURE,
  payload: {},
  error
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

export const getBookInfoByIdRequest = bookId => ({
  type: GET_BOOK_INFO_BY_ID_REQUEST,
  payload: {
    bookId
  }
});

export const getBookInfoByIdSuccess = (bookId, book, users) => ({
  type: GET_BOOK_INFO_BY_ID_SUCCESS,
  payload: {
    bookId,
    book,
    users
  }
});

export const getBookInfoByIdFailure = (bookId, error) => ({
  type: GET_BOOK_INFO_BY_ID_FAILURE,
  payload: {
    bookId
  },
  error
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

export const takeBook = (bookId, userId) => ({
  type: TAKE_BOOK,
  payload: {
    bookId,
    userId
  }
});

export const rollbackTakeBook = (bookId, userId) => ({
  type: ROLLBACK_TAKE_BOOK,
  payload: {
    bookId,
    userId
  }
});

export const returnBook = (bookId, userId) => ({
  type: RETURN_BOOK,
  payload: {
    bookId,
    userId
  }
});

export const rollbackReturnBook = (bookId, userId) => ({
  type: ROLLBACK_RETURN_BOOK,
  payload: {
    bookId,
    userId
  }
});

export const trackBook = (bookId, userId) => ({
  type: TRACK_BOOK,
  payload: {
    bookId,
    userId
  }
});

export const rollbackTrackBook = (bookId, userId) => ({
  type: ROLLBACK_TRACK_BOOK,
  payload: {
    bookId,
    userId
  }
});

export const untrackBook = (bookId, userId) => ({
  type: UNTRACK_BOOK,
  payload: {
    bookId,
    userId
  }
});

export const rollbackUntrackBook = (bookId, userId) => ({
  type: ROLLBACK_UNTRACK_BOOK,
  payload: {
    bookId,
    userId
  }
});

export const likeBook = (bookId, userId) => ({
  type: LIKE_BOOK,
  payload: {
    bookId,
    userId
  }
});

export const rollbackLikeBook = (bookId, userId) => ({
  type: ROLLBACK_LIKE_BOOK,
  payload: {
    bookId,
    userId
  }
});

export const dislikeBook = (bookId, userId) => ({
  type: DISLIKE_BOOK,
  payload: {
    bookId,
    userId
  }
});

export const rollbackDislikeBook = (bookId, userId) => ({
  type: ROLLBACK_DISLIKE_BOOK,
  payload: {
    bookId,
    userId
  }
});
