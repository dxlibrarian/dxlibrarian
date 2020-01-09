import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Link from '../components/Link';
import BookView from '../components/BookView';
import BooksContainer from '../components/BooksContainer';
import Layout from '../components/Layout';
import SearchBox from '../containers/SearchBox';

export default function Index() {
  return (
    <Layout>
      <SearchBox />
      <BooksContainer>
        <BookView
          url="/book?id=1"
          title="Agile менеджмент. Лидерство и управление командами"
          author="Donald Knut"
          total={10}
          free={5}
          displayMode="standard"
          img="http://www.apicius.es/wp-content/uploads/2012/07/IMG-20120714-009211.jpg"
        />
        <BookView
          url="/book?id=2"
          title="Introducing to C#"
          author="Donald Knut"
          total={10}
          free={5}
          displayMode="standard"
        />
        <BookView
          url="/book?id=3"
          title="Introducing to C#"
          author="Donald Knut"
          total={10}
          free={5}
          displayMode="standard"
          img="http://www.apicius.es/wp-content/uploads/2012/07/IMG-20120714-009211.jpg"
        />
      </BooksContainer>
    </Layout>
  );
}
