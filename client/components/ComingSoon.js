import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

export default function ComingSoon() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Coming soon
        </Typography>
        Please contact me: <a href="mailto:anton.zhukov@devexpress.com">anton.zhukov@devexpress.com</a>
      </Box>
    </Container>
  );
}
