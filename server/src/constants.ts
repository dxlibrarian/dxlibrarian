export const APPLICATION_PROTOCOL = 'https';
export const APPLICATION_HOST = 'oy7p4wmpmi.execute-api.us-east-1.amazonaws.com';
export const APPLICATION_BASE_URL = '/prod/DXLibrarian';
export const APPLICATION_ORIGIN = `${APPLICATION_PROTOCOL}://${APPLICATION_HOST}${APPLICATION_BASE_URL}`;

if (process.env.AZURE_CLIENT_ID == null) {
  throw new Error('The process.env.AZURE_CLIENT_ID is required');
}
if (process.env.AZURE_CLIENT_SECRET == null) {
  throw new Error('The process.env.AZURE_CLIENT_SECRET is required');
}
if (process.env.AZURE_CLIENT_TENANT == null) {
  throw new Error('The process.env.AZURE_CLIENT_TENANT is required');
}

export const { AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_CLIENT_TENANT } = process.env;
