import React from 'react';
import BooksContainer from '../containers/BooksContainer';
import Layout from '../components/Layout';
import SearchBox from '../containers/SearchBox';

export default function Page() {
  return (
    <Layout>
      <SearchBox />
      <BooksContainer />
    </Layout>
  );
}
