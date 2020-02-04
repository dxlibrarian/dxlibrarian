import React from 'react';
import * as PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Favorite from '@material-ui/icons/Favorite';

import Card from './Card';

const defaultImage = '/images/book-placeholder.jpg';

export default class BookCard extends React.PureComponent {
  onTake = () => {
    this.props.onTakeBook(this.props.bookId, this.props.userId);
  };

  onReturn = () => {
    this.props.onReturnBook(this.props.bookId, this.props.userId);
  };

  onLike = () => {
    this.props.onLikeBook(this.props.bookId, this.props.userId);
  };

  onDislike = () => {
    this.props.onDislikeBook(this.props.bookId, this.props.userId);
  };

  onTrack = () => {
    this.props.onTrackBook(this.props.bookId, this.props.userId);
  };

  onUntrack = () => {
    this.props.onUntrackBook(this.props.bookId, this.props.userId);
  };

  static defaultProps = {
    isLiked: false,
    isActive: false,
    isTracked: false,
    likesCount: 0,
    img: defaultImage
  };

  static propTypes = {
    img: PropTypes.string,
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    count: PropTypes.number.isRequired,
    displayMode: PropTypes.oneOf(['standard', 'compact', 'minimal']).isRequired,
    likesCount: PropTypes.number.isRequired,
    likes: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeUsers: PropTypes.objectOf(PropTypes.string).isRequired, // PropTypes.arrayOf(PropTypes.string).isRequired,
    trackers: PropTypes.arrayOf(PropTypes.string).isRequired,
    userId: PropTypes.string.isRequired,
    bookId: PropTypes.string.isRequired,
    onTakeBook: PropTypes.func.isRequired,
    onReturnBook: PropTypes.func.isRequired,
    onTrackBook: PropTypes.func.isRequired,
    onUntrackBook: PropTypes.func.isRequired,
    onLikeBook: PropTypes.func.isRequired,
    onDislikeBook: PropTypes.func.isRequired
  };

  render() {
    const {
      bookId,
      title,
      author,
      count,
      displayMode,
      likesCount,
      likes,
      activeUsers,
      trackers,
      userId,
      img
    } = this.props;

    const url = `/book?id=${bookId}`;

    const isActive = userId in activeUsers;
    const isTracked = trackers.indexOf(userId) !== -1;
    const isLiked = likes.indexOf(userId) !== -1;

    const free = count - Object.keys(activeUsers).length;

    return (
      <Card
        displayMode={displayMode}
        elevation={4}
        topText={title}
        middleText={`TOTAL: ${count} / FREE: ${free}`}
        bottomText={author}
        img={img == null ? defaultImage : img}
        url={url}
      >
        {isActive ? (
          <Button onClick={this.onReturn}>Return</Button>
        ) : free > 0 ? (
          <Button onClick={this.onTake}>Take</Button>
        ) : (
          <Button disabled={true}>Take</Button>
        )}
        <Button onClick={isLiked ? this.onDislike : this.onLike}>
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
          <Button onClick={this.onUntrack}>Untrack</Button>
        ) : (
          <Button onClick={this.onTrack}>Track</Button>
        )}
      </Card>
    );
  }
}
