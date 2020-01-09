import { SearchBy, SortBy, Location, DisplayMode } from '../../constants';
import {
  UPDATE_SEARCH_TEXT,
  UPDATE_SEARCH_BY,
  UPDATE_SEARCH_SORT_BY,
  UPDATE_SEARCH_FILTER_BY,
  UPDATE_SEARCH_DISPLAY_MODE
} from '../actionTypes';

const initialState = {
  text: '',
  searchBy: [SearchBy.TITLE, SearchBy.AUTHOR],
  sortBy: SortBy.TITLE_ASC,
  filterBy: [Location.TULA, Location.KALUGA, Location.SPB],
  displayMode: DisplayMode.STANDARD
};

export const search = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SEARCH_TEXT: {
      return {
        ...state,
        text: action.payload.text
      };
    }
    case UPDATE_SEARCH_BY: {
      return {
        ...state,
        searchBy: action.payload.searchBy
      };
    }
    case UPDATE_SEARCH_SORT_BY: {
      return {
        ...state,
        sortBy: action.payload.sortBy
      };
    }
    case UPDATE_SEARCH_FILTER_BY: {
      return {
        ...state,
        filterBy: action.payload.filterBy
      };
    }
    case UPDATE_SEARCH_DISPLAY_MODE: {
      return {
        ...state,
        displayMode: action.payload.displayMode
      };
    }
    default: {
      return state;
    }
  }
};
