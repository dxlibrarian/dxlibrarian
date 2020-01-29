import React, { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import * as PropTypes from 'prop-types';
import sizeMe from 'react-sizeme';
import { useSelector, useDispatch } from 'react-redux';

import { takeBook, returnBook, trackBook, untrackBook, likeBook, dislikeBook } from '../redux/actions';
import BookView from '../components/BookView';

function booksSelector(state) {
  return {
    userId: state.profile.userId,
    books: state.search.books,
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
        onDislikeBook: dislikeBook
      },
      dispatch
    );
  }, [dispatch]);
}

function BooksContainer(props) {
  const { size } = props;

  const { books, displayMode, userId } = useSelector(booksSelector);
  const { onTakeBook, onReturnBook, onTrackBook, onUntrackBook, onLikeBook, onDislikeBook } = useActions();

  const countCardsInRow = Math.floor(size.width / 300) || 1;

  const children = books.map(
    ({ bookId, title, author, count, free, img, likesCount, likes, activeUsers, trackers }, index) => (
      <BookView
        key={index}
        bookId={bookId}
        userId={userId}
        url={`/book?id=${bookId}`}
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
    )
  );

  const countFakeItems = countCardsInRow - (children.length % countCardsInRow);
  for (let fakeIndex = 0; fakeIndex < countFakeItems; fakeIndex++) {
    children.push(null);
  }

  return (
    <div className="root">
      <div className="container">
        {children.map((item, itemIndex) => (
          <div className="item" key={itemIndex} style={{ maxWidth: `${size.width - 20}px` }}>
            {item}
          </div>
        ))}
      </div>
      <style jsx>{`
        .root {
          text-align: center;
          overflow: hidden;
        }
        .container {
          padding: 5px;
          box-sizing: border-box;
          display: inline-block;
          margin-left: auto;
          margin-right: auto;
        }
        .container:after {
          clear: both;
        }
        .row {
          white-space: nowrap;
        }
        .item {
          white-space: normal;
          display: inline-block;
          padding: 10px;
          width: 300px;
          box-sizing: border-box;
          overflow: hidden;
          vertical-align: top;
        }
      `}</style>
    </div>
  );
}

BooksContainer.propTypes = {
  size: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }).isRequired
};

export default sizeMe()(BooksContainer);
