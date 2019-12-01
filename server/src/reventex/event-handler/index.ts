import { TEvent } from '../event';
import { TMutationApi } from '../mutation-api/mutation-api';

export type TEventHandler = ({
  documentId,
  event,
  api
}: {
  documentId: string;
  event: TEvent;
  api: TMutationApi;
}) => void;

export type TAsyncEventHandler = ({
  documentId,
  event,
  api
}: {
  documentId: string;
  event: TEvent;
  api: TMutationApi;
}) => Promise<void>;
