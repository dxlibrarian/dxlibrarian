import React, { memo } from 'react';
import * as PropTypes from 'prop-types';
import sizeMe from 'react-sizeme';

function CardContainer(props) {
  const { size, children } = props;

  const countCardsInRow = Math.floor(size.width / 300) || 1;

  const items = [].concat(children);

  const countFakeItems = countCardsInRow - (items.length % countCardsInRow);
  for (let fakeIndex = 0; fakeIndex < countFakeItems; fakeIndex++) {
    items.push(null);
  }

  return (
    <div className="root">
      <div className="container">
        {items.map((item, itemIndex) => (
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

CardContainer.propTypes = {
  size: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

export default memo(sizeMe()(memo(CardContainer)));
