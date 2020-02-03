import tcomb from 'tcomb-validation';
import { projection } from '../../reventex/server';

import { Event, EntityName, Location } from '../../constants';
import { validate } from '../../utils/validate';

export default projection
  .name(EntityName.BOOK)
  .index({ bookId: 1 }, { unique: true })
  .index({ userId: 1 })
  .index({ title: 1 })
  .index({ author: 1 })
  .index({ location: 1 })
  .index({ tags: 1 })
  .index({ likes: 1 })
  .on(Event.BOOK_CREATED, function*({ event, api: { set } }) {
    validate(
      event.payload,
      tcomb.struct({
        bookId: tcomb.String,
        userId: tcomb.String,
        title: tcomb.String,
        author: tcomb.String,
        count: tcomb.Number,
        pageCount: tcomb.Number,
        location: tcomb.enums.of([Location.TULA, Location.KALUGA, Location.SPB]),
        ISBN: tcomb.maybe(tcomb.String),
        tags: tcomb.list(tcomb.String),
        img: tcomb.maybe(tcomb.String)
      })
    );

    const likes: Array<string> = [];
    const activeUsers: Array<string> = [];
    const trackers: Array<string> = [];
    const { bookId, userId, title, author, count, pageCount, location, ISBN, tags, img } = event.payload;

    yield set({
      userId,
      bookId,
      title,
      author,
      count,
      pageCount,
      location,
      ISBN,
      tags,
      img,
      likes,
      activeUsers,
      trackers
    });
  })
  .on(Event.BOOK_REMOVED, function*({ event, api: { remove } }) {
    validate(
      event.payload,
      tcomb.struct({
        bookId: tcomb.String
      })
    );

    yield remove();
  })
  .on(Event.BOOK_UPDATED, function*({ event, api: { set } }) {
    validate(
      event.payload,
      tcomb.struct({
        bookId: tcomb.String,
        key: tcomb.enums.of(['title', 'author', 'count', 'location', 'ISBN', 'tags', 'pageCount', 'img'])
      })
    );

    const { key, value } = event.payload;

    switch (key) {
      case 'title':
      case 'author':
      case 'ISBN':
      case 'img': {
        validate(
          event.payload,
          tcomb.struct({
            bookId: tcomb.String,
            key: tcomb.String,
            value: tcomb.String
          })
        );
        break;
      }
      case 'count':
      case 'pageCount': {
        validate(
          event.payload,
          tcomb.struct({
            bookId: tcomb.String,
            key: tcomb.String,
            value: tcomb.String
          })
        );
        break;
      }
      case 'location': {
        validate(
          event.payload,
          tcomb.struct({
            bookId: tcomb.String,
            key: tcomb.String,
            value: tcomb.enums.of([Location.TULA, Location.KALUGA, Location.SPB])
          })
        );
        break;
      }
    }

    yield set(key, value);
  })
  .on(Event.BOOK_LIKED_BY_USER, function*({ event, api: { addToSet } }) {
    validate(
      event.payload,
      tcomb.struct({
        bookId: tcomb.String,
        userId: tcomb.String
      })
    );

    const { userId } = event.payload;

    yield addToSet('likes', userId);
  })
  .on(Event.BOOK_DISLIKED_BY_USER, function*({ event, api: { pullEQ } }) {
    validate(
      event.payload,
      tcomb.struct({
        bookId: tcomb.String,
        userId: tcomb.String
      })
    );

    const { userId } = event.payload;

    yield pullEQ('likes', userId);
  })
  .on(Event.BOOK_TRACKED_BY_USER, function*({ event, api: { addToSet } }) {
    validate(
      event.payload,
      tcomb.struct({
        bookId: tcomb.String,
        userId: tcomb.String
      })
    );

    const { userId } = event.payload;

    yield addToSet('trackers', userId);
  })
  .on(Event.BOOK_UNTRACKED_BY_USER, function*({ event, api: { pullEQ } }) {
    validate(
      event.payload,
      tcomb.struct({
        bookId: tcomb.String,
        userId: tcomb.String
      })
    );

    const { userId } = event.payload;

    yield pullEQ('trackers', userId);
  })

  .on(Event.BOOK_TAKEN_BY_USER, function*({ event, api: { addToSet, pullEQ } }) {
    validate(
      event.payload,
      tcomb.struct({
        bookId: tcomb.String,
        userId: tcomb.String
      })
    );

    const { userId } = event.payload;

    yield addToSet('activeUsers', userId);
    yield pullEQ('trackers', userId);
  })
  .on(Event.BOOK_RETURNED_BY_USER, function*({ event, api: { pullEQ } }) {
    validate(
      event.payload,
      tcomb.struct({
        bookId: tcomb.String,
        userId: tcomb.String
      })
    );

    const { userId } = event.payload;

    yield pullEQ('activeUsers', userId);
  });
