import { MongoClient } from 'mongodb';

import { domain, projection, entityId } from '../reventex/server';
import { Request, Response } from '../types';

const calculator = projection
  .name('Calculator')
  .on('ADD', function*({ event, documentId, api: { increment } }) {
    console.log('increment start', event.payload.value);
    yield increment('value', event.payload.value);
    console.log('increment end', event.payload.value);
  })
  .on('SUB', function*({ event, documentId, api: { decrement } }) {
    console.log('decrement start', event.payload.value);
    yield decrement('value', event.payload.value);
    console.log('decrement end', event.payload.value);
  });

import { MONGO_USER, MONGO_PASSWORD, MONGO_DOMAIN, MONGO_DATABASE } from '../constants';

const mongoConnectionUrl = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_DOMAIN}/${MONGO_DATABASE}?retryWrites=true&w=majority`;

function createDomain() {
  return domain
    .connect(
      MongoClient.connect(mongoConnectionUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    )
    .database('DXLibrarian')
    .eventStore('Events')
    .projections([calculator]);
}

export async function readHandler(
  req: Request<
    any,
    {
      entityName: string;
      documentId: string;
    }
  >,
  res: Response
): Promise<void> {
  const { entityName, documentId } = req.query;

  const { publish, close } = createDomain();

  const calculatorId = entityId('Calculator');

  console.log(calculatorId);

  console.log('publish start');
  await publish([
    {
      type: 'ADD',
      payload: {
        value: 5,
        calculatorId
      }
    },
    {
      type: 'ADD',
      payload: {
        value: 10,
        calculatorId
      }
    },
    {
      type: 'SUB',
      payload: {
        value: 8,
        calculatorId
      }
    }
  ]);
  console.log('publish end');

  console.log('close start');
  await close();
  console.log('close end');

  res.end('ok');
}
