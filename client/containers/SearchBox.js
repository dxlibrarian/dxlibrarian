import React, { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { SearchBy, SortBy, Location, DisplayMode } from '../constants';
import { updateSearchText } from '../redux/actions';

const searchByList = Object.keys(SearchBy).map(key => ({ key, value: SearchBy[key] }));

const sortByList = Object.keys(SortBy).map(key => ({ key, value: SortBy[key] }));

const displayModeList = Object.keys(DisplayMode).map(key => ({ key, value: DisplayMode[key] }));

const locationList = Object.keys(Location).map(key => ({ key, value: Location[key] }));

const useStyles = makeStyles(theme => ({
  searchBox: {
    padding: '2px 4px 2px 12px',
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(2)
  },
  controls: {
    margin: theme.spacing(1)
  },
  control: {
    margin: theme.spacing(1),
    width: '230px'
  }
}));

function searchSelector(state) {
  return state.search;
}

function getPlaceholder(searchBy) {
  const isIncludesTitle = searchBy.indexOf(SearchBy.TITLE) !== -1;
  const isIncludesAuthor = searchBy.indexOf(SearchBy.AUTHOR) !== -1;
  if (isIncludesTitle && isIncludesAuthor) {
    return 'Book Title or Author';
  } else if (isIncludesTitle && !isIncludesAuthor) {
    return 'Book Title';
  } else if (!isIncludesTitle && isIncludesAuthor) {
    return 'Book Author';
  } else {
    return '';
  }
}

function updateText({ target: { value } }) {
  return updateSearchText(value);
}

export function useActions() {
  const dispatch = useDispatch();
  return useMemo(() => {
    return bindActionCreators(
      {
        updateText
      },
      dispatch
    );
  }, [dispatch]);
}

export default function SearchBox() {
  const classes = useStyles();

  const { text, searchBy, sortBy, filterBy, displayMode } = useSelector(searchSelector);

  const { updateText } = useActions();

  const placeholder = getPlaceholder(searchBy);

  return (
    <div>
      <Paper elevation={4} component="form" className={classes.searchBox}>
        <FormControl fullWidth>
          <InputBase
            placeholder={placeholder}
            inputProps={{ 'aria-label': 'search' }}
            value={text}
            onChange={updateText}
          />
        </FormControl>
        <IconButton aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      <div className={classes.controls}>
        <FormControl className={classes.control}>
          <InputLabel>Search by</InputLabel>
          <Select value={searchBy} onChange={() => {}} multiple renderValue={selected => selected.join(', ')}>
            {searchByList.map(({ key, value }) => (
              <MenuItem key={key} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.control}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sortBy} onChange={() => {}}>
            {sortByList.map(({ key, value }) => (
              <MenuItem key={key} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.control}>
          <InputLabel>Display mode</InputLabel>
          <Select value={displayMode} onChange={() => {}}>
            {displayModeList.map(({ key, value }) => (
              <MenuItem key={key} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.control}>
          <InputLabel>Filter by</InputLabel>
          <Select value={filterBy} onChange={() => {}} multiple renderValue={selected => selected.join(', ')}>
            {locationList.map(({ key, value }) => (
              <MenuItem key={key} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
