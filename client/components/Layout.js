import React, { memo } from 'react';
import PropTypes from 'prop-types';

import TopMenu from './TopMenu';

function Layout({ children }) {
  return (
    <React.Fragment>
      <TopMenu />
      {children}
    </React.Fragment>
  );
}

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default memo(Layout);
