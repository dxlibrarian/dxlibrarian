if (process.env.GATEWAY_PROTOCOL == null) {
  throw new Error('The process.env.GATEWAY_PROTOCOL is required');
}
if (process.env.GATEWAY_HOST == null) {
  throw new Error('The process.env.GATEWAY_HOST is required');
}
if (process.env.GATEWAY_BASE_URL == null) {
  throw new Error('The process.env.GATEWAY_BASE_URL is required');
}
if (process.env.GITHUB_IO_ORIGIN == null) {
  throw new Error('The process.env.GITHUB_IO_ORIGIN is required');
}
if (process.env.AZURE_CLIENT_ID == null) {
  throw new Error('The process.env.AZURE_CLIENT_ID is required');
}
if (process.env.AZURE_CLIENT_SECRET == null) {
  throw new Error('The process.env.AZURE_CLIENT_SECRET is required');
}
if (process.env.AZURE_CLIENT_TENANT == null) {
  throw new Error('The process.env.AZURE_CLIENT_TENANT is required');
}
if (process.env.JWT_SECRET == null) {
  throw new Error('The process.env.JWT_SECRET is required');
}
if (process.env.MONGO_USER == null) {
  throw new Error('The process.env.MONGO_USER is required');
}
if (process.env.MONGO_PASSWORD == null) {
  throw new Error('The process.env.MONGO_PASSWORD is required');
}
if (process.env.MONGO_DOMAIN == null) {
  throw new Error('The process.env.MONGO_DOMAIN is required');
}
if (process.env.MONGO_DATABASE == null) {
  throw new Error('The process.env.MONGO_DATABASE is required');
}
if (process.env.INT_DX_AUTH == null) {
  throw new Error('The process.env.INT_DX_AUTH is required');
}
if (process.env.AVATAR_SALT == null) {
  throw new Error('The process.env.AVATAR_SALT is required');
}

export const {
  AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET,
  AZURE_CLIENT_TENANT,
  JWT_SECRET,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_DOMAIN,
  MONGO_DATABASE,
  GITHUB_IO_ORIGIN,
  GATEWAY_PROTOCOL,
  GATEWAY_HOST,
  GATEWAY_BASE_URL,
  INT_DX_AUTH,
  AVATAR_SALT
} = process.env;

export const GATEWAY_ORIGIN = `${GATEWAY_PROTOCOL}://${GATEWAY_HOST}${GATEWAY_BASE_URL}`;

export enum Event {
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_REMOVED = 'USER_REMOVED',

  USER_SETTINGS_UPDATED = 'USER_SETTINGS_UPDATED',

  BOOK_CREATED = 'BOOK_CREATED',
  BOOK_UPDATED = 'BOOK_UPDATED',
  BOOK_REMOVED = 'BOOK_REMOVED',

  BOOK_TAKEN_BY_USER = 'BOOK_TAKEN_BY_USER',
  BOOK_RETURNED_BY_USER = 'BOOK_RETURNED_BY_USER',

  BOOK_LIKED_BY_USER = 'BOOK_LIKED_BY_USER',
  BOOK_DISLIKED_BY_USER = 'BOOK_DISLIKED_BY_USER',

  BOOK_TRACKED_BY_USER = 'BOOK_TRACKED_BY_USER',
  BOOK_UNTRACKED_BY_USER = 'BOOK_UNTRACKED_BY_USER'
}

export enum EntityName {
  USER = 'Users',
  BOOK = 'Books'
}

export enum Location {
  TULA = 'Tula',
  KALUGA = 'Kaluga',
  SPB = 'Saint Petersburg'
}

export enum Resolver {
  GET_ALL_USERS = 'getAllUsers',
  GET_USER = 'getUser',
  SEARCH_BOOKS = 'searchBooks',
  SHOW_MY_ACTIVE_BOOKS = 'showMyActiveBooks',
  SHOW_MY_TRACKED_BOOKS = 'showMyTrackedBooks',
  SHOW_MY_BOOK_HISTORY = 'showMyBookHistory'
}

export const DATABASE_NAME = 'DXLibrarian';
export const EVENT_STORE_COLLECTION_NAME = 'Events';
