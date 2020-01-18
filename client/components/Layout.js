import React from 'react';

import TopMenu from './TopMenu';

export default function Layout({ children }) {
  return (
    <React.Fragment>
      <TopMenu />
      {children}
    </React.Fragment>
  );
}
