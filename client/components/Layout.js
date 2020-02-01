import React from 'react';
import PropTypes from 'prop-types';

import TopMenu from './TopMenu';

export default function Layout({ children }) {
  return (
    <React.Fragment>
      <TopMenu />
      {children}
    </React.Fragment>
  );
}

Layout.propTypes = {
  children: PropTypes.element
};
