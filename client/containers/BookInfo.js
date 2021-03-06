import React, { useMemo, useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { useSelector, useDispatch } from 'react-redux';

import { takeBook, returnBook, trackBook, untrackBook, likeBook, dislikeBook } from '../redux/actions';
import BookCard from '../components/BookCard';
import UserCard from '../components/UserCard';
import CardContainer from '../components/CardContainer';

import { getBookInfoByIdRequest } from '../redux/actions';

function useActions() {
  const dispatch = useDispatch();
  return useMemo(() => {
    return bindActionCreators(
      {
        getBookInfoById: getBookInfoByIdRequest,
        onTakeBook: takeBook,
        onReturnBook: returnBook,
        onTrackBook: trackBook,
        onUntrackBook: untrackBook,
        onLikeBook: likeBook,
        onDislikeBook: dislikeBook
      },
      dispatch
    );
  }, [dispatch]);
}

function getBookById(bookId) {
  return function search(book) {
    return book.bookId === bookId;
  };
}

function bookInfoSelector(state) {
  console.log({
    userId: state.profile.userId,
    book: state.search.books.find(getBookById(state.bookInfo.bookId)),
    users: state.bookInfo.users,
    displayMode: state.search.displayMode.toLowerCase()
  });

  return {
    userId: state.profile.userId,
    book: state.bookInfo.book,
    users: state.bookInfo.users,
    displayMode: state.search.displayMode.toLowerCase()
  };
}

const BookInfo = ({ bookId }) => {
  const {
    getBookInfoById,
    onTakeBook,
    onReturnBook,
    onTrackBook,
    onUntrackBook,
    onLikeBook,
    onDislikeBook
  } = useActions();
  const { userId, book, users, displayMode } = useSelector(bookInfoSelector);

  const [isMounted, updateMountStatus] = useState(null);
  useEffect(() => {
    if (!isMounted) {
      updateMountStatus(true);
      getBookInfoById(bookId);
    }
  });

  if (!isMounted || book == null) {
    return null;
  }

  const { title, author, count, img, likesCount, likes, activeUsers, trackers } = book;

  const children = [
    <BookCard
      key={0}
      bookId={bookId}
      userId={userId}
      title={title}
      author={author}
      count={count}
      displayMode={displayMode}
      img={img}
      likes={likes}
      likesCount={likesCount}
      activeUsers={activeUsers}
      trackers={trackers}
      onTakeBook={onTakeBook}
      onReturnBook={onReturnBook}
      onTrackBook={onTrackBook}
      onUntrackBook={onUntrackBook}
      onLikeBook={onLikeBook}
      onDislikeBook={onDislikeBook}
    />,
    ...users
      .filter(({ userId }) => activeUsers[userId] != null)
      .map(({ userId, name, email, avatar }, index) => (
        <UserCard
          key={index + 1}
          name={name}
          email={email}
          date={activeUsers[userId]}
          displayMode={displayMode}
          avatar={avatar}
        />
      ))
  ];

  return <CardContainer>{children}</CardContainer>;
};

BookInfo.propTypes = {
  bookId: PropTypes.string.isRequired
};

export default memo(BookInfo);
