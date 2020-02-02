import React from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Link from './Link';

const useStyles = makeStyles(() => ({
  image: {
    color: 'inherit',
    textDecoration: 'none',
    display: 'table-cell',
    height: '100%',
    backgroundPositionX: '50%',
    backgroundPositionY: '50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    cursor: 'pointer'
  }
}));

function CardImage({ url, src }) {
  const classes = useStyles();

  if (url == null) {
    return (
      <div
        className={classes.image}
        style={{
          backgroundImage: `url("${src}")`
        }}
      />
    );
  } else {
    return (
      <Link
        href={url}
        naked
        className={classes.image}
        style={{
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

export default CardImage;
