import { projection } from '../../reventex/server';
import { Events } from '../events';

export default projection
  .name('user')
  .index({ id: 1 }, { unique: true })
  .on(Events.USER_CREATED, function*({ event, api: { set } }) {
    let { firstName, lastName, nameInRussian, email, office, location, id, avatarToken } = event.payload;

    email = email.toLowerCase();

    yield set({
      firstName,
      lastName,
      nameInRussian,
      email,
      office,
      location,
      id,
      avatarToken
    });
  })
  .on(Events.USER_UPDATED, function*({ event, api: { merge } }) {
    yield merge({});
  })
  .on(Events.USER_REMOVED, function*({ event, api: { remove } }) {
    yield remove();
  });
