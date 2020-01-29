function action(type: string): string {
  return `@REVENTEX/${type}`;
}

export const PUBLISH_REQUEST = action('PUBLISH_REQUEST');
export const PUBLISH_SUCCESS = action('PUBLISH_SUCCESS');
export const PUBLISH_FAILURE = action('PUBLISH_FAILURE');

export const READ_REQUEST = action('READ_REQUEST');
export const READ_SUCCESS = action('READ_SUCCESS');
export const READ_FAILURE = action('READ_FAILURE');
