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

// gets all the stylists, uincludes the joined property which will be true if stylist offers that service (if join table row exists of the stylist for the service), and false otherwise
const getServiceStylistOptions = (serviceId) =>
  new Promise((resolve, reject) => {
    const queryString = serviceId ? `?serviceId=${serviceId}` : '';
    fetch(`${clientCredentials.databaseURL}/userinfo${queryString}`)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });

export { getAllUserInfos, getSingleUserInfo, getStylists, getServiceStylistOptions };
