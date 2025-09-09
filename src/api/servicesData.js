import { clientCredentials } from '../utils/client';

const getServices = () =>
  new Promise((resolve, reject) => {
    fetch(`${clientCredentials.databaseURL}/services`)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });

const getServiceById = (id) =>
  new Promise((resolve, reject) => {
    fetch(`${clientCredentials.databaseURL}/services/${id}`)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });

const getServicesByCategory = (categoryId) =>
  new Promise((resolve, reject) => {
    fetch(`${clientCredentials.databaseURL}/services?categoryId=${categoryId}`)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });

const getServicesByStylist = (stylistId) =>
  new Promise((resolve, reject) => {
    fetch(`${clientCredentials.databaseURL}/services?stylistId=${stylistId}`)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });

const getStylistsByService = (serviceId) =>
  new Promise((resolve, reject) => {
    fetch(`${clientCredentials.databaseURL}/services/${serviceId}/stylists`)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });

const createService = (service) =>
  new Promise((resolve, reject) => {
    fetch(`${clientCredentials.databaseURL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(service),
    })
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });

const updateService = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${clientCredentials.databaseURL}/services/${payload.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });

const deleteService = (id) =>
  new Promise((resolve, reject) => {
    fetch(`${clientCredentials.databaseURL}/services/${id}`, {
      method: 'DELETE',
    })
      .then(resolve)
      .catch(reject);
  });

const addStylistToService = (serviceId, stylistId) =>
  new Promise((resolve, reject) => {
    fetch(`${clientCredentials.databaseURL}/services/${serviceId}/add_stylist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stylist: Number(stylistId) }),
    })
      .then(resolve)
      .catch(reject);
  });

const removeStylistFromService = (serviceId, stylistId) =>
  new Promise((resolve, reject) => {
    fetch(`${clientCredentials.databaseURL}/services/${serviceId}/remove_stylist?stylistId=${stylistId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(resolve)
      .catch(reject);
  });

export { getServices, getServiceById, getServicesByCategory, getServicesByStylist, getStylistsByService, createService, updateService, deleteService, addStylistToService, removeStylistFromService };
