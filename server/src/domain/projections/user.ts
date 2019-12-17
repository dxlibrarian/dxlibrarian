import { projection } from '../../reventex/server';
import { Events } from '../events';

export default projection
  .name('user')
  .index({ id: 1 }, { unique: true })
  .on(Events.USER_CREATED, function*({ event, api: { set } }) {
    const { id, name, email } = event.payload;

    yield set({
      id,
      name,
      email
    });
  })
  .on(Events.USER_UPDATED, function*({ event, api: { merge } }) {
    yield merge({});
  })
  .on(Events.USER_REMOVED, function*({ event, api: { remove } }) {
    yield remove();
  });
