import React from 'react';
import * as PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Favorite from '@material-ui/icons/Favorite';
import { makeStyles } from '@material-ui/core/styles';

import Link from '../components/Link';

const defaultImage = '/images/book-placeholder.jpg';

const useStyles = makeStyles(() => ({
  image: {
    color: 'inherit',
    textDecoration: 'none',
    display: 'table-cell',
    height: '100%',
    backgroundPositionX: '50%',
    backgroundPositionY: '50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    cursor: 'pointer'
  }
}));

function BookImage({ url, src }) {
  const classes = useStyles();

  return (
    <Link
      href={url}
      naked
      className={classes.image}
      style={{
        backgroundImage: `url("${src}")`
      }}
    />
  );
}

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

    if (book == null) {
      return false;
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

  refRoot = domElement => {
    this.book = domElement;
  };

  static defaultProps = {
    isLiked: false,
    isActive: false,
    isTracked: false,
    likesCount: 0
  };

  static propTypes = {
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    count: PropTypes.number.isRequired,
    displayMode: PropTypes.oneOf(['standard', 'compact', 'minimal']).isRequired,
    likesCount: PropTypes.number.isRequired,
    likes: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeUsers: PropTypes.arrayOf(PropTypes.string).isRequired,
    trackers: PropTypes.arrayOf(PropTypes.string).isRequired,
    userId: PropTypes.string.isRequired
  };

  render() {
    const { url, title, author, count, displayMode, likesCount, likes, activeUsers, trackers, userId } = this.props;
    const { img } = this.state;

    const isActive = activeUsers.indexOf(userId) !== -1;
    const isTracked = trackers.indexOf(userId) !== -1;
    const isLiked = likes.indexOf(userId) !== -1;

    const free = count - activeUsers.length;

    const imageSource = img == null ? defaultImage : img;

    return (
      <span>
        <Paper elevation={4}>
          <div className="root" ref={this.refRoot}>
            <div className={`card card--${displayMode}`}>
              <div className="container">
                <div className="sub-container">
                  <div className="title-container">
                    <div className={`title title--${displayMode}`}>{title}</div>
                  </div>
                  <div className="image-container">
                    <BookImage url={url} src={imageSource} />
                  </div>
                  <div className="count-container">
                    <div className={`count count--${displayMode}`}>{`TOTAL: ${count} / FREE: ${free}`}</div>
                  </div>
                  {author != null ? (
                    <div className="author-container">
                      <div className={`author author--${displayMode}`}>{author}</div>
                    </div>
                  ) : null}
                  <div className="controls-container">
                    <div className="controls">
                      {isActive ? (
                        <Button>Return</Button>
                      ) : free ? (
                        <Button>Take</Button>
                      ) : (
                        <Button disabled={true}>Take</Button>
                      )}
                      <Button>
                        <Favorite
                          color="primary"
                          style={{
                            opacity: isLiked ? 0.66 : 0.25,
                            marginRight: likesCount > 0 ? '5px' : undefined
                          }}
                        />
                        {likesCount > 0 ? likesCount : ''}
                      </Button>
                      {isActive ? (
                        <Button disabled={true}>Track</Button>
                      ) : isTracked ? (
                        <Button>Untrack</Button>
                      ) : (
                        <Button>Track</Button>
                      )}
                    </div>
                  </div>
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
          .controls-container {
            display: table-row;
          }
          .controls {
            display: table-cell;
            text-align: center;
            padding: 10px 0;
          }
        `}</style>
      </span>
    );
  }
}
