import tcomb from 'tcomb-validation';

import { resolver } from '../../reventex/server';

import { validate } from '../../utils/validate';

import { EntityName, Resolver } from '../../constants';

export default resolver.name(Resolver.GET_USER).on(async ({ database, session }, args) => {
  validate(
    args,
    tcomb.struct({
      userId: tcomb.String
    })
  );

  const { userId } = args;

  const collection = database.collection(EntityName.USER);

  const user = await collection.findOne(
    {
      userId
    },
    { session }
  );

  return user;
});
