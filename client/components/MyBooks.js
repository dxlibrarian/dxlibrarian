import React, { memo } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TabBody from './TabBody';
import MyActiveBooks from '../containers/MyActiveBooks';
import MyTrackedBooks from '../containers/MyTrackedBooks';

function MyBooks() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Tabs value={value} onChange={handleChange} indicatorColor="secondary" textColor="secondary" variant="fullWidth">
        <Tab label="Active Books" />
        <Tab label="Tracked Books" />
      </Tabs>
      <TabBody value={value} index={0}>
        <MyActiveBooks />
      </TabBody>
      <TabBody value={value} index={1}>
        <MyTrackedBooks />
      </TabBody>
    </div>
  );
}

export default memo(MyBooks);
