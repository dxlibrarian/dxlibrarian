import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Link from '../components/Link';
import BookView from '../components/BookView';


export default function Index() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js example
        </Typography>
        <BookView
          title='Introducing to C#'
          author='Donald Knut'
          total={10}
          free={5}
          displayMode='standard'
          img='http://www.apicius.es/wp-content/uploads/2012/07/IMG-20120714-009211.jpg'
        />

        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
      </Box>
    </Container>
  );
}
