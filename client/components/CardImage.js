import React, { memo } from 'react';
import * as PropTypes from 'prop-types';

import Link from './Link';

function CardImage({ url, src }) {
  if (url == null) {
    return (
      <div
        style={{
          color: 'inherit',
          textDecoration: 'none',
          display: 'table-cell',
          height: '100%',
          backgroundPositionX: '50%',
          backgroundPositionY: '50%',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundImage: `url("${src}")`
        }}
      />
    );
  } else {
    return (
      <Link
        href={url}
        naked
        style={{
          color: 'inherit',
          textDecoration: 'none',
          display: 'table-cell',
          height: '100%',
          backgroundPositionX: '50%',
          backgroundPositionY: '50%',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          cursor: 'pointer',
          backgroundImage: `url("${src}")`
        }}
      />
    );
  }
}

CardImage.propTypes = {
  url: PropTypes.string,
  src: PropTypes.string.isRequired
};

export default memo(CardImage);
