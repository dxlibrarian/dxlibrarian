import React, { memo } from 'react';
import * as PropTypes from 'prop-types';

import Card from './Card';

const defaultImage = '/images/avatar-placeholder.png';

function CardImage({ displayMode, name, email, avatar, takeTime }) {
  return (
    <Card
      topText={name}
      bottomText={`${takeTime} - NOW`}
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
  takeTime: PropTypes.string
};

export default memo(CardImage);
