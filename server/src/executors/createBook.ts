import tcomb from 'tcomb-validation';

import { entityId } from '../reventex/server';

import { createDomain } from '../domain/createDomain';
import { Event, EntityName } from '../constants';
import { getLog } from '../utils/getLog';
import { validate } from '../utils/validate';

import { Location } from '../constants';

const log = getLog('dxlibrarian:create-book');

export async function createBook(params: {
  userId: string;
  title: string;
  author: string;
  count: number;
  pageCount: number;
  location: string;
  tags: Array<string>;
  ISBN?: string;
  img?: string;
}) {
  validate(
    params,
    tcomb.struct({
      userId: tcomb.String,
      title: tcomb.String,
      author: tcomb.String,
      count: tcomb.Number,
      pageCount: tcomb.Number,
      location: tcomb.enums.of([Location.TULA, Location.KALUGA, Location.SPB]),
      tags: tcomb.list(tcomb.String),
      ISBN: tcomb.maybe(tcomb.String),
      img: tcomb.maybe(tcomb.String)
    })
  );

  const { userId, title, author, count, pageCount, location, ISBN, tags, img } = params;

  const { publish, close } = createDomain();

  try {
    log.debug('Executor "createBook" has been started');

    log.debug('Operation "publish" has been started');
    await publish([
      {
        type: Event.BOOK_CREATED,
        payload: {
          bookId: entityId(EntityName.BOOK),
          userId: entityId(EntityName.USER, userId),
          title,
          author,
          count,
          pageCount,
          location,
          ISBN,
          tags,
          img
        }
      }
    ]);
    log.debug('Operation "publish" has been finished');

    log.debug('Executor "createBook" has been finished');
  } catch (error) {
    log.debug('Executor "createBook" has been failed');
    throw error;
  } finally {
    log.debug('Operation "close" has been started');
    await close();
    log.debug('Operation "close" has been finished');
  }
}
