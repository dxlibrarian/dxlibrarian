import { parse } from 'query-string';
import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Link from '../components/Link';
import Layout from '../components/Layout';
import { IS_CLIENT } from '../constants';

function getBookId() {
  if (IS_CLIENT) {
    const { id } = parse(window.location.search);
    return id;
  } else {
    return null;
  }
}

export default function Book() {
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            {`Book id = ${getBookId()}`}
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
}
