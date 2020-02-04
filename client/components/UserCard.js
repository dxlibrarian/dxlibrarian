import React, { memo } from 'react';
import * as PropTypes from 'prop-types';

import Card from './Card';

const defaultImage = '/images/avatar-placeholder.png';

function CardImage({ displayMode, name, email, avatar, date }) {
  const today = new Date(date);
  let dd = today.getDate();
  let mm = today.getMonth() + 1;

  const yyyy = today.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }

  return (
    <Card
      topText={name}
      bottomText={`${dd}/${mm}/${yyyy} - NOW`}
      displayMode={displayMode}
      elevation={1}
      img={avatar == null ? defaultImage : avatar}
    >
      <a href={`mailto:${email}`}>{email}</a>
    </Card>
  );
}

CardImage.propTypes = {
  displayMode: PropTypes.oneOf(['standard', 'compact', 'minimal']).isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  date: PropTypes.string
};

export default memo(CardImage);
