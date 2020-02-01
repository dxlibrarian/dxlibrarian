import { useRouter } from 'next/router';
import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Layout from '../components/Layout';
import BookInfo from '../containers/BookInfo';

export default function Book() {
  const {
    query: { id: bookId }
  } = useRouter();

  return <Layout>{bookId != null ? <BookInfo bookId={bookId} /> : null}</Layout>;
}
