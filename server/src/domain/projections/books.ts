import tcomb from 'tcomb-validation';
import { projection } from '../../reventex/server';

import { Event, EntityName, Location } from '../../constants';
import { validate } from '../../utils/validate';

export default projection
  .name(EntityName.BOOK)
  .index({ bookId: 1 }, { unique: true })
  .index({ userId: 1 })
  .index({ title: 1 })
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
        location: tcomb.enums.of([Location.TULA, Location.KALUGA, Location.SPB]),
        ISBN: tcomb.maybe(tcomb.String),
        tags: tcomb.list(tcomb.String),
        pageCount: tcomb.maybe(tcomb.Number),
        img: tcomb.maybe(tcomb.String)
      })
    );

    const likes: Array<string> = [];
    const { bookId, userId, title, author, count, location, ISBN, tags, pageCount, img } = event.payload;

    yield set({
      userId,
      bookId,
      title,
      author,
      count,
      location,
      ISBN,
      tags,
      pageCount,
      img,
      likes
    });
  });
