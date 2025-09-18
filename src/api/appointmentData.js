import { clientCredentials } from '../utils/client';

// get service availability by date (plus optionally by stylist)
const getAvailability = (serviceId, date, stylistId = null) =>
  new Promise((resolve, reject) => {
    let url = `${clientCredentials.databaseURL}/services/${serviceId}/availability/?date=${date}`;
    if (stylistId) {
      url += `&stylist_id=${stylistId}`;
    }
    fetch(url)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });

export default getAvailability;
