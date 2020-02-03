import { TAKE_BOOK, RETURN_BOOK, TRACK_BOOK, UNTRACK_BOOK, LIKE_BOOK, DISLIKE_BOOK } from '../actionTypes';
import {
  rollbackTakeBook,
  rollbackReturnBook,
  rollbackTrackBook,
  rollbackUntrackBook,
  rollbackLikeBook,
  rollbackDislikeBook
} from '../actions';
import { entityId } from '../../../server/src/reventex/client.mjs';

const EventType = {
  BOOK_TAKEN_BY_USER: 'BOOK_TAKEN_BY_USER',
  BOOK_RETURNED_BY_USER: 'BOOK_RETURNED_BY_USER',

  BOOK_LIKED_BY_USER: 'BOOK_LIKED_BY_USER',
  BOOK_DISLIKED_BY_USER: 'BOOK_DISLIKED_BY_USER',

  BOOK_TRACKED_BY_USER: 'BOOK_TRACKED_BY_USER',
  BOOK_UNTRACKED_BY_USER: 'BOOK_UNTRACKED_BY_USER'
};

const EntityName = {
  USER: 'Users',
  BOOK: 'Books'
};

export const publishMiddleware = api => store => {
  return next => async action => {
    next(action);
    switch (action.type) {
      case TAKE_BOOK: {
        try {
          await api.publish({
            events: [
              {
                type: EventType.BOOK_TAKEN_BY_USER,
                payload: {
                  bookId: entityId(EntityName.BOOK, action.payload.bookId),
                  userId: entityId(EntityName.USER, action.payload.userId)
                }
              }
            ]
          });
        } catch (error) {
          store.dispatch(rollbackTakeBook(action.payload.bookId, action.payload.userId));
        }

        break;
      }
      case RETURN_BOOK: {
        try {
          await api.publish({
            events: [
              {
                type: EventType.BOOK_RETURNED_BY_USER,
                payload: {
                  bookId: entityId(EntityName.BOOK, action.payload.bookId),
                  userId: entityId(EntityName.USER, action.payload.userId)
                }
              }
            ]
          });
        } catch (error) {
          store.dispatch(rollbackReturnBook(action.payload.bookId, action.payload.userId));
        }

        break;
      }

      case LIKE_BOOK: {
        try {
          await api.publish({
            events: [
              {
                type: EventType.BOOK_LIKED_BY_USER,
                payload: {
                  bookId: entityId(EntityName.BOOK, action.payload.bookId),
                  userId: entityId(EntityName.USER, action.payload.userId)
                }
              }
            ]
          });
        } catch (error) {
          store.dispatch(rollbackLikeBook(action.payload.bookId, action.payload.userId));
        }

        break;
      }
      case DISLIKE_BOOK: {
        try {
          await api.publish({
            events: [
              {
                type: EventType.BOOK_DISLIKED_BY_USER,
                payload: {
                  bookId: entityId(EntityName.BOOK, action.payload.bookId),
                  userId: entityId(EntityName.USER, action.payload.userId)
                }
              }
            ]
          });
        } catch (error) {
          store.dispatch(rollbackDislikeBook(action.payload.bookId, action.payload.userId));
        }

        break;
      }

      case TRACK_BOOK: {
        try {
          await api.publish({
            events: [
              {
                type: EventType.BOOK_TRACKED_BY_USER,
                payload: {
                  bookId: entityId(EntityName.BOOK, action.payload.bookId),
                  userId: entityId(EntityName.USER, action.payload.userId)
                }
              }
            ]
          });
        } catch (error) {
          store.dispatch(rollbackTrackBook(action.payload.bookId, action.payload.userId));
        }

        break;
      }
      case UNTRACK_BOOK: {
        try {
          await api.publish({
            events: [
              {
                type: EventType.BOOK_UNTRACKED_BY_USER,
                payload: {
                  bookId: entityId(EntityName.BOOK, action.payload.bookId),
                  userId: entityId(EntityName.USER, action.payload.userId)
                }
              }
            ]
          });
        } catch (error) {
          store.dispatch(rollbackUntrackBook(action.payload.bookId, action.payload.userId));
        }

        break;
      }
    }
  };
};
