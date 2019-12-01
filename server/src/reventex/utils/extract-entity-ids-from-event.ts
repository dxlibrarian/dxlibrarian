import { EntityId } from '../entity-id';
import { TEvent } from '../event';

const recursive = (entityIds: Array<EntityId>, value: any, dictionary: any, dictionaryKey: any) => {
  if (value instanceof EntityId) {
    if (
      !entityIds.find(function(entityId: EntityId) {
        return entityId.entityName === value.entityName && entityId.documentId === value.documentId;
      })
    ) {
      entityIds.push(value);
      dictionary[dictionaryKey] = value.documentId;
    }
  } else if (Array.isArray(value)) {
    const size = value.length;
    for (let index = 0; index < size; index++) {
      recursive(entityIds, value[index], value, index);
    }
  } else if (value === Object(value)) {
    for (let key in value) {
      if (!value.hasOwnProperty(key)) {
        continue;
      }
      recursive(entityIds, value[key], value, key);
    }
  }
};

export function extractEntityIdsFromEvent(event: TEvent) {
  const entityIds: Array<EntityId> = [];
  recursive(entityIds, event, { event }, 'event');
  return entityIds;
}
