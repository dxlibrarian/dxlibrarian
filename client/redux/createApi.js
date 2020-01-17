import Cookies from 'js-cookie';
import queryString from 'query-string';
import tcomb from 'tcomb-validation';

import { validate } from '../validate';

import { API_GATEWAY_URL, SearchBy, Location } from '../constants';

export function createApi() {
  function getHeaders() {
    return {
      Authorization: `Bearer ${Cookies.get('jwtToken')}`,
      Accept: 'application/json'
    };
  }

  async function maybeThrowError(response) {
    if (response.status >= 400 && response.status <= 599) {
      const error = new Error('Fetch error');
      error.stack = await response.text();
      throw error;
    }
  }

  async function get(url, data) {
    const query = Object.keys(data).length === 0 ? '' : `?${queryString.stringify(data, { arrayFormat: 'bracket' })}`;

    const response = await fetch(`${API_GATEWAY_URL}${url}${query}`, {
      method: 'GET',
      headers: getHeaders()
    });

    await maybeThrowError(response);

    return response.json();
  }

  async function post(url, data) {
    const response = await fetch(`${API_GATEWAY_URL}${url}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: getHeaders()
    });

    await maybeThrowError(response);

    return response.json();
  }

  return {
    searchBooks({ text, searchBy, filterBy }) {
      validate(
        {
          text,
          searchBy,
          filterBy
        },
        tcomb.struct({
          text: tcomb.String,
          searchBy: tcomb.list(tcomb.enums.of([SearchBy.AUTHOR, SearchBy.TITLE])),
          filterBy: tcomb.list(tcomb.enums.of([Location.TULA, Location.KALUGA, Location.SPB]))
        })
      );

      return get('/api/read', {
        resolverName: 'searchBooks',
        text,
        searchBy,
        filterBy
      });
    }
  };
}
