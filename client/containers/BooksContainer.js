import React from 'react';
import * as PropTypes from 'prop-types';
import sizeMe from 'react-sizeme';
import { useSelector } from 'react-redux';

import BookView from '../components/BookView';

function booksSelector(state) {
  return {
    books: state.books,
    displayMode: state.search.displayMode.toLowerCase()
  };
}

function BooksContainer(props) {
  const { size } = props;

  const { books, displayMode } = useSelector(booksSelector);

  const countCardsInRow = Math.floor(size.width / 300) || 1;

  const children = books.map(({ id, title, author, total, free, img }, index) => (
    <BookView
      key={index}
      url={`/book?id=${id}`}
      title={title}
      author={author}
      total={total}
      free={free}
      displayMode={displayMode}
      img={img}
    />
  ));

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
