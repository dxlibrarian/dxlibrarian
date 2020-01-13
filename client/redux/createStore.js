import { parse } from 'query-string';
import Cookies from 'js-cookie';
import { createStore as createReduxStore, combineReducers, applyMiddleware, compose } from 'redux';

import { middlewares } from './middlewares';
import { reducers } from './reducers';
import { login, authorize } from './actions';
import { createApi } from './createApi';
import { IS_CLIENT } from '../constants';

const composeEnhancers = (IS_CLIENT && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const createStore = () => {
  const api = createApi();

  const store = createReduxStore(
    combineReducers(reducers),
    composeEnhancers(applyMiddleware(...middlewares.map(createMiddleware => createMiddleware(api))))
  );

  if (IS_CLIENT) {
    let jwtToken;
    ({ jwtToken } = parse(window.location.search));
    if (jwtToken == null) {
      jwtToken = Cookies.get('jwtToken');
    }

    if (jwtToken != null && jwtToken.constructor === String && jwtToken.length > 0) {
      store.dispatch(login(jwtToken));
    } else {
      store.dispatch(authorize(jwtToken));
    }
  }

  return store;
};
