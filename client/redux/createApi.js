import Cookies from 'js-cookie';
import queryString from 'query-string';
import tcomb from 'tcomb-validation';
import { toast } from 'react-toastify';

import { validate } from '../validate';
import { serialize, EntityId } from '../../server/src/reventex/client.mjs';

import { API_GATEWAY_URL, SearchBy, Location } from '../constants';

export function createApi() {
  function getHeaders() {
    return {
      Authorization: `Bearer ${Cookies.get('jwtToken')}`,
      Accept: 'application/json',
      'Content-type': 'application/json'
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

  function showError(error) {
    toast(`FetchError: ${error.message}`, {
      type: toast.TYPE.ERROR,
      autoClose: 5000,
      draggable: false
    });
  }

  const api = {
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
    },
    publish({ events }) {
      validate(
        {
          events
        },
        tcomb.struct({
          events: tcomb.list(
            tcomb.struct({
              type: tcomb.String,
              payload: tcomb.Object
            })
          )
        })
      );

      return post('/api/publish', {
        events: serialize(events)
      });
    }
  };

  for (const methodName of Object.keys(api)) {
    const method = api[methodName];
    api[methodName] = async (...args) => {
      try {
        return await method(...args);
      } catch (error) {
        showError(error);
        throw error;
      }
    };
  }

  return api;
}
