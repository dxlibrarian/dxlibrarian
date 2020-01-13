import React from 'react';

import TopMenu from './TopMenu';
import Copyright from './Copyright';

export default function Layout({ children }) {
  return (
    <React.Fragment>
      <TopMenu />
      {children}
      <Copyright />
    </React.Fragment>
  );
}
