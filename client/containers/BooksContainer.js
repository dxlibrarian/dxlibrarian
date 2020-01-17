import React from 'react';
import * as PropTypes from 'prop-types';
import sizeMe from 'react-sizeme';
import { useSelector } from 'react-redux';

import BookView from '../components/BookView';

function booksSelector(state) {
  return {
    userId: state.profile.userId,
    books: state.search.books,
    displayMode: state.search.displayMode.toLowerCase()
  };
}

function BooksContainer(props) {
  const { size } = props;

  const { books, displayMode, userId } = useSelector(booksSelector);

  const countCardsInRow = Math.floor(size.width / 300) || 1;

  const children = books.map(
    ({ bookId, title, author, count, free, img, likesCount, likes, activeUsers, trackers }, index) => (
      <BookView
        key={index}
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
