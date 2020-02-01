import NextRouter from 'next/router';
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
    let jwtToken = NextRouter.query.jwtToken;
    if (jwtToken == null) {
      jwtToken = Cookies.get('jwtToken');
    }

    const settings = {};
    try {
      Object.assign(settings, JSON.parse(Cookies.get('settings')));
    } catch (error) {}

    if (jwtToken != null && jwtToken.constructor === String && jwtToken.length > 0) {
      store.dispatch(login(jwtToken, settings));
    } else {
      store.dispatch(authorize(jwtToken, settings));
    }
  }

  return store;
};
