import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { makeStyles } from '@material-ui/core/styles';

import Link from '../components/Link';

const useStyles = makeStyles(() => ({
  menuItem: {
    color: 'inherit',
    textDecoration: 'none'
  }
}));

function avatarSelector(state) {
  return state.profile.avatar;
}

function TopMenuAvatar() {
  const classes = useStyles();

  const avatar = useSelector(avatarSelector);

  return (
    <Link href="/profile" naked className={classes.menuItem}>
      <IconButton aria-label="profile" color="inherit">
        {avatar == null ? <AccountCircle /> : <img src={avatar} />}
      </IconButton>
    </Link>
  );
}

export default memo(TopMenuAvatar);
