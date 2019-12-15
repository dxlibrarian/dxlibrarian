import md5 from 'md5';
import axios from 'axios';

import { INT_DX_AUTH, AVATAR_SALT } from '../constants';

export async function importUsers() {
  console.log(INT_DX_AUTH);

  let usersData = (
    await axios.get('https://int.devexpress.com/analytics/info/EmployeesInfo', {
      headers: { Authorization: INT_DX_AUTH }
    })
  ).data;
  console.log(usersData);

  if (usersData[0] === '(' && usersData[usersData.length - 1] === ')') {
    usersData = usersData.slice(1).slice(0, -1);
  }

  const users = JSON.parse(usersData).reduce((result: any, user: any) => {
    user.avatarToken = md5(user.email + AVATAR_SALT);
    result[user.email] = user;
    return result;
  }, {});

  console.log('users');
  console.log(JSON.stringify(users, null, 2));

  return users;
}
