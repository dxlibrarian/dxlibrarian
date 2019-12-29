import React from 'react';
import Typography from '@material-ui/core/Typography';

const year = new Date().getFullYear();

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © Anton Zhukov'}
      {' '}
      {year}
    </Typography>
  );
}
