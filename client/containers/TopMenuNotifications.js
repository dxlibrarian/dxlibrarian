import React from 'react'
import { useSelector } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { makeStyles } from '@material-ui/core/styles';

import Link from '../components/Link'

const useStyles = makeStyles(() => ({
  menuItem: {
    color:'inherit',
    textDecoration: 'none'
  }
}));

function notificationSelector(state) {
  return state.notifications.length
}

export default function TopMenuNotifications() {
  const notifications = useSelector(notificationSelector)

  const classes = useStyles();

  return (
    <Link href='/notifications' naked className={classes.menuItem}>
      <IconButton aria-label={`show ${notifications} new notifications`} color="inherit">
        <Badge badgeContent={notifications} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </Link>
  )
}
