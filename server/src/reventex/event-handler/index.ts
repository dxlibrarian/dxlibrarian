import { TEvent } from '../event';
import { Effect, EffectFactory } from '../effects/types';

export type TEventHandler = ({
  documentId,
  event,
  api
}: {
  documentId: string;
  event: TEvent;
  api: EffectFactory;
}) => IterableIterator<Effect>;
