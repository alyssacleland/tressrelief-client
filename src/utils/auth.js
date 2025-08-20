import firebase from 'firebase/app';
import 'firebase/auth';
import { API_BASE } from './api';

const signIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
};

const signOut = () => {
  firebase.auth().signOut();
};

// call  DRF endpoint to get-or-create the UserInfo row
const getOrCreateUser = (payload) =>
  fetch(`${API_BASE}/get-or-create-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  }).then((r) => r.json());

export { signIn, signOut, getOrCreateUser };
