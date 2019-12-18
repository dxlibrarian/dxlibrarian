import { projection } from '../../reventex/server';

import { Event, EntityName } from '../../constants';

export default projection
  .name(EntityName.USER)
  .index({ id: 1 }, { unique: true })
  .on(Event.USER_CREATED, function*({ event, api: { set } }) {
    const { id, name, email } = event.payload;

    yield set({
      id,
      name,
      email
    });
  })
  .on(Event.USER_UPDATED, function*({ event, api: { merge } }) {
    const { id, name, email } = event.payload;

    yield merge({
      id,
      name,
      email
    });
  })
  .on(Event.USER_REMOVED, function*({ api: { remove } }) {
    yield remove();
  });
