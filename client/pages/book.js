import { useRouter } from 'next/router';
import React from 'react';

import Layout from '../components/Layout';
import BookInfo from '../containers/BookInfo';

export default function Book() {
  const {
    query: { id: bookId }
  } = useRouter();

  return <Layout>{bookId != null ? <BookInfo bookId={bookId} /> : null}</Layout>;
}
