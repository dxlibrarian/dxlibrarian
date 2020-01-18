import { SearchBy, SortBy, Location, DisplayMode } from '../../constants';
import {
  UPDATE_SEARCH_TEXT,
  UPDATE_SEARCH_BY,
  UPDATE_SEARCH_SORT_BY,
  UPDATE_SEARCH_FILTER_BY,
  UPDATE_SEARCH_DISPLAY_MODE,
  SEARCH_BOOKS_SUCCESS,
  AUTHORIZE,
  LOGIN
} from '../actionTypes';

const sortFunctions = {
  [SortBy.TITLE_ASC]: (a, b) => (a.title > b.title ? 1 : a.title < b.title ? -1 : 0),
  [SortBy.TITLE_DESC]: (a, b) => (a.title > b.title ? -1 : a.title < b.title ? 1 : 0),
  [SortBy.AUTHOR_ASC]: (a, b) => (a.author > b.author ? 1 : a.author < b.author ? -1 : 0),
  [SortBy.AUTHOR_DESC]: (a, b) => (a.author > b.author ? -1 : a.author < b.author ? 1 : 0),
  [SortBy.LIKES_ASC]: (a, b) => (a.likesCount > b.likesCount ? 1 : a.likesCount < b.likesCount ? -1 : 0),
  [SortBy.LIKES_DESC]: (a, b) => (a.likesCount > b.likesCount ? -1 : a.likesCount < b.likesCount ? 1 : 0)
};

const initialState = {
  books: [],
  text: '',
  searchBy: [SearchBy.TITLE, SearchBy.AUTHOR],
  sortBy: SortBy.TITLE_ASC,
  filterBy: [Location.TULA, Location.KALUGA, Location.SPB],
  displayMode: DisplayMode.STANDARD
};

export const search = (state = initialState, action) => {
  switch (action.type) {
    case AUTHORIZE:
    case LOGIN: {
      return {
        ...state,
        ...action.payload.settings
      };
    }
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
    case UPDATE_SEARCH_SORT_BY: {
      return {
        ...state,
        books: state.books.sort(sortFunctions[action.payload.sortBy]),
        sortBy: action.payload.sortBy
      };
    }
    case SEARCH_BOOKS_SUCCESS: {
      return {
        ...state,
        books: action.payload.books
          .map(book => ({ ...book, likesCount: book.likes.length }))
          .sort(sortFunctions[state.sortBy])
      };
    }
    default: {
      return state;
    }
  }
};
