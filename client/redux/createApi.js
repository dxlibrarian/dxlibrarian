import Cookies from 'js-cookie';
import queryString from 'query-string';
import tcomb from 'tcomb-validation';

import { validate } from '../validate';

import { API_GATEWAY_URL, SearchBy, SortBy, Location } from '../constants';

export function createApi() {
  function getHeaders() {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${Cookies.get('jwtToken')}`);
    headers.append('Accept', 'application/json');
    return headers;
  }

  async function get(url, data) {
    const query = Object.keys(data).length === 0 ? '' : `?${queryString.stringify(data)}`;

    const response = await fetch(`${API_GATEWAY_URL}${url}${query}`, {
      method: 'GET',
      headers: getHeaders(),
      mode: 'cors',
      credentials: 'include'
    });

    return response.json();
  }

  async function post(url, data) {
    const response = await fetch(`${API_GATEWAY_URL}${url}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: getHeaders(),
      mode: 'cors',
      credentials: 'include'
    });

    return response.json();
  }

  return {
    searchBooks({ text, searchBy, sortBy, filterBy }) {
      validate(
        {
          text,
          searchBy,
          sortBy,
          filterBy
        },
        tcomb.struct({
          text: tcomb.String,
          searchBy: tcomb.list(tcomb.enums.of([SearchBy.AUTHOR, SearchBy.TITLE])),
          sortBy: tcomb.enums.of([
            SortBy.TITLE_ASC,
            SortBy.TITLE_DESC,
            SortBy.AUTHOR_ASC,
            SortBy.AUTHOR_DESC,
            SortBy.LIKES_ASC,
            SortBy.LIKES_DESC
          ]),
          filterBy: tcomb.list(tcomb.enums.of([Location.TULA, Location.KALUGA, Location.SPB]))
        })
      );

      return get('/api/books', {
        text,
        searchBy,
        sortBy,
        filterBy
      });
    }
  };
}
