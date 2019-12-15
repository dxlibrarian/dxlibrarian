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
