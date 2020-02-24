import React, { useState, useEffect, memo, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { useSelector, useDispatch } from 'react-redux';

import {
  showMyActiveBooksRequest,
  takeBook,
  returnBook,
  trackBook,
  untrackBook,
  likeBook,
  dislikeBook
} from '../redux/actions';

import BookCard from '../components/BookCard';
import CardContainer from '../components/CardContainer';

function booksSelector(state) {
  return {
    userId: state.profile.userId,
    books: state.myActiveBooks.books,
    displayMode: state.search.displayMode.toLowerCase()
  };
}

export function useActions() {
  const dispatch = useDispatch();
  return useMemo(() => {
    return bindActionCreators(
      {
        onTakeBook: takeBook,
        onReturnBook: returnBook,
        onTrackBook: trackBook,
        onUntrackBook: untrackBook,
        onLikeBook: likeBook,
        onDislikeBook: dislikeBook,
        onMount: showMyActiveBooksRequest
      },
      dispatch
    );
  }, [dispatch]);
}

function MyActiveBooks() {
  const { userId, books, displayMode } = useSelector(booksSelector);
  const { onTakeBook, onReturnBook, onTrackBook, onUntrackBook, onLikeBook, onDislikeBook, onMount } = useActions();
  const [isMounted, updateMountStatus] = useState(null);
  useEffect(() => {
    if (!isMounted) {
      updateMountStatus(true);
      onMount();
    }
  });

  if (!isMounted) {
    return null;
  }

  return (
    <CardContainer>
      {books.map(({ bookId, title, author, count, img, likesCount, likes, activeUsers, trackers }, index) => (
        <BookCard
          key={index}
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
        />
      ))}
    </CardContainer>
  );
}

export default memo(MyActiveBooks);
