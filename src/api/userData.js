import { clientCredentials } from '../utils/client';

const getAllUserInfos = () =>
  new Promise((resolve, reject) => {
    fetch(`${clientCredentials.databaseURL}/userinfo`)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });

const getSingleUserInfo = (id) =>
  new Promise((resolve, reject) => {
    fetch(`${clientCredentials.databaseURL}/userinfo/${id}`)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });

const getStylists = () =>
  new Promise((resolve, reject) => {
    fetch(`${clientCredentials.databaseURL}/userinfo?role=stylist`)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });

export { getAllUserInfos, getSingleUserInfo, getStylists };
