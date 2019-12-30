import React from 'react';
import sizeMe from 'react-sizeme';

class BooksContainer extends React.PureComponent {
  render() {
    const countCardsInRow = Math.floor(this.props.size.width / 300) || 1;

    const children = [].concat(this.props.children);

    const countFakeItems = countCardsInRow - (children.length % countCardsInRow);
    for (let fakeIndex = 0; fakeIndex < countFakeItems; fakeIndex++) {
      children.push(null);
    }

    return (
      <div className="root">
        <div className="container">
          {children.map((item, itemIndex) => (
            <div className="item" key={itemIndex} style={{ maxWidth: `${this.props.size.width - 20}px` }}>
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
}

export default sizeMe()(BooksContainer);
