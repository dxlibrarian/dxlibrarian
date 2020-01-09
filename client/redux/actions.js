import {
  LOGIN,
  AUTHORIZE,
  UPDATE_SEARCH_TEXT,
  UPDATE_SEARCH_BY,
  UPDATE_SEARCH_SORT_BY,
  UPDATE_SEARCH_FILTER_BY,
  UPDATE_SEARCH_DISPLAY_MODE
} from './actionTypes';

export const login = jwtToken => ({
  type: LOGIN,
  payload: {
    jwtToken
  }
});

export const authorize = () => ({
  type: AUTHORIZE
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
