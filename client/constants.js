export const IS_CLIENT = typeof window !== 'undefined';
export const API_GATEWAY_URL = 'https://oy7p4wmpmi.execute-api.us-east-1.amazonaws.com/prod/DXLibrarian';

export const SearchBy = {
  TITLE: 'Title',
  AUTHOR: 'Author'
};

export const SortBy = {
  TITLE_ASC: 'Title (A -> Z)',
  TITLE_DESC: 'Title (Z -> A)',
  AUTHOR_ASC: 'Author (A -> Z)',
  AUTHOR_DESC: 'Author (Z -> A)',
  LIKES_ASC: 'Likes (0 -> +\u221E)',
  LIKES_DESC: 'Likes (+\u221E -> 0)'
};

export const DisplayMode = {
  STANDARD: 'Standard',
  COMPACT: 'Compact',
  MINIMAL: 'Minimal'
};

export const Location = {
  TULA: 'Tula',
  KALUGA: 'Kaluga',
  SPB: 'Saint Petersburg'
};
