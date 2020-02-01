import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { useSelector, useDispatch } from 'react-redux';

import { getBookInfoByIdRequest } from '../redux/actions';

export function useActions() {
  const dispatch = useDispatch();
  return useMemo(() => {
    return bindActionCreators(
      {
        getBookInfoById: getBookInfoByIdRequest
      },
      dispatch
    );
  }, [dispatch]);
}

const BookInfo = ({ bookId }) => {
  const [isMounted, updateMountStatus] = useState(null);

  const { getBookInfoById } = useActions();

  useEffect(() => {
    if (!isMounted) {
      console.log('bookinfo mounted');
      updateMountStatus(true);
      getBookInfoById(bookId);
    }
  });

  if (!isMounted) {
    return null;
  }

  return <div>BookInfo {bookId}</div>;
};

BookInfo.propTypes = {
  bookId: PropTypes.string.isRequired
};

export default BookInfo;
