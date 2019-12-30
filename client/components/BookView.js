import React from 'react';
import Paper from '@material-ui/core/Paper';

const defaultImage = '/images/book_placeholder.jpg';

export default class BookView extends React.PureComponent {
  // eslint-disable-next-line no-unused-vars
  state = {
    img: '/images/spinner.gif'
  };

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onScroll);
    this.onScroll();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    clearTimeout(this.timer);
  }

  onScroll = () => {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.checkVisibleAndOptionalLoadImage, 100);
  };

  checkVisibleAndOptionalLoadImage = () => {
    if (this.isVisible()) {
      this.setState({
        img: this.props.img
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.img !== prevState.img) {
      this.onScroll();
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (state.img !== props.img) {
      return {
        img: props.img
      };
    }

    // Return null to indicate no change to state.
    return null;
  }

  isVisible = () => {
    let book = this.book;

    if(book == null) {
      return false
    }

    let top = book.offsetTop;
    let height = book.offsetHeight;

    while (book.offsetParent) {
      book = book.offsetParent;
      top += book.offsetTop;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return top < scrollTop + window.innerHeight && top + height > scrollTop;
  };

  refRoot = (domElement) => {
    this.book = domElement
  }

  render() {
    const { title, author, total, free, displayMode, children, onImageClick } = this.props;

    const { img } = this.state;

    let imageSource = img || defaultImage;

    return (
      <span>
        <Paper elevation={3}>
          <div className="root" ref={this.refRoot}>
            <div className={`card card--${displayMode}`}>
              <div className="container">
                <div className="sub-container">
                  <div className="title-container">
                    <div className={`title title--${displayMode}`}>{title}</div>
                  </div>
                  <div className="image-container">
                    <div
                      className="image-sub-container"
                      style={{
                        color: 'red',
                        backgroundImage: `url("${imageSource}")`,
                        cursor: onImageClick ? 'pointer' : undefined
                      }}
                    />
                  </div>
                  <div className="count-container">
                    <div className={`count count--${displayMode}`}>{`TOTAL: ${total} / FREE: ${free}`}</div>
                  </div>
                  {author ? (
                    <div className="author-container">
                      <div className={`author author--${displayMode}`}>{author}</div>
                    </div>
                  ) : null}
                  {children}
                </div>
              </div>
            </div>
          </div>
        </Paper>
        <style jsx>{`
          .root {
            position: relative;
          }
          .card {
            position: relative;
          }
          .card--standard {
            padding-top: 133%;
          }
          .card--compact {
            padding-top: 100%;
          }
          .card--minimal {
            padding-top: 75%;
          }
          .container {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
          }
          .sub-container {
            display: table;
            width: 100%;
            height: 100%;
          }
          .title-container {
            display: table-row;
          }
          .title {
            text-align: center;
            display: table-cell;
            padding: 15px;
            font-size: 16px;
          }
          .title--minimal {
            font-size: 13px;
          }
          .image-container {
            display: table-row;
          }
          .image-sub-container {
            display: table-cell;
            height: 100%;
            background-position-x: 50%;
            background-position-y: 50%;
            background-repeat: no-repeat;
            background-size: contain;
          }
          .author-container {
            display: table-row;
          }
          .author {
            display: table-cell;
            padding: 0 15px;
            text-align: center;
            font-size: 16px;
          }
          .author--minimal {
            font-size: 13px;
          }
          .count-container {
            display: table-row;
          }
          .count {
            display: table-cell;
            text-align: center;
            color: #666;
            font-size: 12px;
            padding: 10px 15px;
          }
          .count--minimal {
            font-size: 9px;
          }
        `}</style>
      </span>
    );
  }
}
