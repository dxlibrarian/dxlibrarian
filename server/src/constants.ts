export const APPLICATION_PROTOCOL = 'https';
export const APPLICATION_HOST = 'oy7p4wmpmi.execute-api.us-east-1.amazonaws.com';
export const APPLICATION_BASE_URL = '/prod/DXLibrarian';
export const APPLICATION_ORIGIN = `${APPLICATION_PROTOCOL}://${APPLICATION_HOST}${APPLICATION_BASE_URL}`;

export const CLIENT_ORIGIN = 'https://dxlibrarian.github.io';

if (process.env.AZURE_CLIENT_ID == null) {
  throw new Error('The process.env.AZURE_CLIENT_ID is required');
}
if (process.env.AZURE_CLIENT_SECRET == null) {
  throw new Error('The process.env.AZURE_CLIENT_SECRET is required');
}
if (process.env.JWT_SECRET == null) {
  throw new Error('The process.env.JWT_SECRET is required');
}

export const { AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, JWT_SECRET } = process.env;
