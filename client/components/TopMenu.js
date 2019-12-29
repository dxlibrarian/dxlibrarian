import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem'
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';

import Link from './Link'
import TopMenuNotifications from '../containers/TopMenuNotifications'
import TopMenuAvatar from '../containers/TopMenuAvatar'

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  titleContainer: {
    flexGrow: 1,
  },
  title: {
    color:'inherit',
    textDecoration: 'none'
  },
  menuItem: {
    color:'inherit',
    textDecoration: 'none'
  }
}));

export default function TopMenu() {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={handleMenu}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" className={classes.titleContainer}>
          <Link href="/" className={classes.title} naked >DXLibrarian</Link>
        </Typography>

        <div>
          <TopMenuNotifications/>
          <TopMenuAvatar/>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={open}
            onClose={handleClose}
          >
            <Link href="/" className={classes.menuItem} naked>
              <MenuItem onClick={handleClose}>
                Library
              </MenuItem>
            </Link>
            <Link href="/my-books" className={classes.menuItem} naked>
              <MenuItem onClick={handleClose}>
                My Books
              </MenuItem>
            </Link>
            <Link href="/new-book" className={classes.menuItem} naked>
              <MenuItem onClick={handleClose}>
              Add a New Book
              </MenuItem>
            </Link>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  )
}
