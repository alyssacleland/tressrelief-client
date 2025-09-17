import { clientCredentials } from '../utils/client';

// Check current OAuth status
const getOAuthStatus = (uid) =>
  new Promise((resolve, reject) => {
    fetch(`${clientCredentials.databaseURL}/oauth/google/status`, {
      headers: { Authorization: uid },
    })
      .then((res) => res.json())
      .then(resolve)
      .catch(reject);
  });

// Start OAuth flow (returns URL for Google consent screen)
const initiateOAuth = (uid) =>
  new Promise((resolve, reject) => {
    fetch(`${clientCredentials.databaseURL}/oauth/google/initiate`, {
      headers: { Authorization: uid },
    })
      .then((res) => res.json())
      .then(resolve)
      .catch(reject);
  });

export { getOAuthStatus, initiateOAuth };
