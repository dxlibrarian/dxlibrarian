import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

export default function TabBody({ children, value, index, ...other }) {
  return (
    <Typography component="div" hidden={value !== index} {...other}>
      {value === index ? <Box p={3}>{children}</Box> : null}
    </Typography>
  );
}

TabBody.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};
