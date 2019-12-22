import tcomb from 'tcomb-validation';
import { projection } from '../../reventex/server';

import { Event, EntityName } from '../../constants';
import { validate } from '../../utils/validate';

export default projection
  .name(EntityName.USER)
  .index({ userId: 1 }, { unique: true })
  .on(Event.USER_CREATED, function*({ event, api: { set } }) {
    validate(
      event.payload,
      tcomb.struct({
        userId: tcomb.String,
        name: tcomb.String,
        email: tcomb.String
      })
    );

    const { userId, name, email } = event.payload;

    const activeBooks: Array<string> = [];
    const trackedBooks: Array<string> = [];
    const likedBooks: Array<string> = [];
    const historyBooks: Array<string> = [];

    yield set({
      userId,
      name,
      email,
      activeBooks,
      trackedBooks,
      likedBooks,
      historyBooks
    });
  })
  .on(Event.USER_REMOVED, function*({ api: { remove } }) {
    yield remove();
  })
  .on(Event.USER_UPDATED, function*({ event, api: { merge } }) {
    validate(
      event.payload,
      tcomb.struct({
        userId: tcomb.String,
        name: tcomb.String,
        email: tcomb.String,
        avatar: tcomb.maybe(tcomb.String),
        location: tcomb.maybe(tcomb.String),
        office: tcomb.maybe(tcomb.String)
      })
    );

    const { userId, name, email, avatar, location } = event.payload;

    yield merge({
      userId,
      name,
      email,
      avatar,
      location
    });
  })
  .on(Event.BOOK_LIKED_BY_USER, function*({ event, api: { pushFront } }) {
    validate(
      event.payload,
      tcomb.struct({
        bookId: tcomb.String,
        userId: tcomb.String
      })
    );

    const { bookId } = event.payload;

    yield pushFront('likedBooks', bookId);
  })
  .on(Event.BOOK_DISLIKED_BY_USER, function*({ event, api: { pullEQ } }) {
    validate(
      event.payload,
      tcomb.struct({
        bookId: tcomb.String,
        userId: tcomb.String
      })
    );

    const { bookId } = event.payload;

    yield pullEQ('likedBooks', bookId);
  })
  .on(Event.BOOK_TRACKED_BY_USER, function*({ event, api: { pushFront } }) {
    validate(
      event.payload,
      tcomb.struct({
        bookId: tcomb.String,
        userId: tcomb.String
      })
    );

    const { bookId } = event.payload;

    yield pushFront('trackedBooks', bookId);
  })
  .on(Event.BOOK_UNTRACKED_BY_USER, function*({ event, api: { pullEQ } }) {
    validate(
      event.payload,
      tcomb.struct({
        bookId: tcomb.String,
        userId: tcomb.String
      })
    );

    const { bookId } = event.payload;

    yield pullEQ('trackedBooks', bookId);
  })
  .on(Event.BOOK_TAKEN_BY_USER, function*({ event, api: { pushFront } }) {
    validate(
      event.payload,
      tcomb.struct({
        bookId: tcomb.String,
        userId: tcomb.String
      })
    );

    const { bookId } = event.payload;

    yield pushFront('activeBooks', bookId);
    yield pushFront('historyBooks', bookId);
  })
  .on(Event.BOOK_RETURNED_BY_USER, function*({ event, api: { pullEQ } }) {
    validate(
      event.payload,
      tcomb.struct({
        bookId: tcomb.String,
        userId: tcomb.String
      })
    );

    const { bookId } = event.payload;

    yield pullEQ('activeBooks', bookId);
  });
