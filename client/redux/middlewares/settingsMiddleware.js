import Cookies from 'js-cookie';

import {
  UPDATE_SEARCH_BY,
  UPDATE_SEARCH_FILTER_BY,
  UPDATE_SEARCH_DISPLAY_MODE,
  UPDATE_SEARCH_SORT_BY
} from '../actionTypes';

export const settingsMiddleware = () => () => next => action => {
  let patch;

  switch (action.type) {
    case UPDATE_SEARCH_BY: {
      patch = { searchBy: action.payload.searchBy };
      break;
    }
    case UPDATE_SEARCH_FILTER_BY: {
      patch = { filterBy: action.payload.filterBy };
      break;
    }
    case UPDATE_SEARCH_DISPLAY_MODE: {
      patch = { displayMode: action.payload.displayMode };
      break;
    }
    case UPDATE_SEARCH_SORT_BY: {
      patch = { sortBy: action.payload.sortBy };
      break;
    }
    default: {
      return next(action);
    }
  }

  const settings = {};
  try {
    Object.assign(settings, JSON.parse(Cookies.get('settings')));
  } catch (error) {}
  Object.assign(settings, patch);

  Cookies.set('settings', JSON.stringify(settings), { expires: 365 });

  next(action);
};
