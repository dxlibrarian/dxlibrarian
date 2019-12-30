import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import TopMenu from '../components/TopMenu';
import Copyright from '../components/Copyright';
import theme from '../theme';
import { createStore } from '../redux/createStore';

export default class MyApp extends App {
  store = createStore();

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>My page</title>
        </Head>
        <Provider store={this.store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <TopMenu />
            <Component {...pageProps} />
            <Copyright />
          </ThemeProvider>
        </Provider>
      </React.Fragment>
    );
  }
}
