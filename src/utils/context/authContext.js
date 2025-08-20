// // Context API Docs: https://beta.reactjs.org/learn/passing-data-deeply-with-context

// 'use client';

// import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
// import { firebase } from '@/utils/client';

// const AuthContext = createContext();

// AuthContext.displayName = 'AuthContext'; // Context object accepts a displayName string property. React DevTools uses this string to determine what to display for the context. https://reactjs.org/docs/context.html#contextdisplayname

// function AuthProvider(props) {
//   const [user, setUser] = useState(null);

//   // there are 3 states for the user:
//   // null = application initial state, not yet loaded
//   // false = user is not logged in, but the app has loaded
//   // an object/value = user is logged in

//   useEffect(() => {
//     firebase.auth().onAuthStateChanged((fbUser) => {
//       if (fbUser) {
//         setUser(fbUser);
//       } else {
//         setUser(false);
//       }
//     }); // creates a single global listener for auth state changed
//   }, []);

//   const value = useMemo(
//     // https://reactjs.org/docs/hooks-reference.html#usememo
//     () => ({
//       user,
//       userLoading: user === null,
//       // as long as user === null, will be true
//       // As soon as the user value !== null, value will be false
//     }),
//     [user],
//   );

//   return <AuthContext.Provider value={value} {...props} />;
// }
// const AuthConsumer = AuthContext.Consumer;

// const useAuth = () => {
//   const context = useContext(AuthContext);

//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export { AuthProvider, useAuth, AuthConsumer };

'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { firebase } from '@/utils/client';
import { getOrCreateUser } from '@/utils/auth';

const AuthContext = createContext();
AuthContext.displayName = 'AuthContext';

function AuthProvider(props) {
  const [user, setUser] = useState(null); // null | false | object

  useEffect(() => {
    // This subscribes to Firebase auth state. It fires whenever login status changes.
    const unsub = firebase.auth().onAuthStateChanged((fbUser) => {
      if (fbUser) {
        // Supply defaults from Firebase to your Django API
        getOrCreateUser({
          uid: fbUser.uid,
          display_name: fbUser.displayName, // becomes display_name
          googleEmail: fbUser.email, // becomes google_email
        }).then((serverUser) => {
          setUser({ fbUser, ...serverUser }); // merge raw Firebase + your DB row
        });
      } else {
        setUser(false);
      }
    });
    return () => unsub();
  }, []);

  const value = useMemo(
    () => ({
      user,
      userLoading: user === null,
    }),
    [user],
  );

  return <AuthContext.Provider value={value} {...props} />;
}

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export { AuthProvider, useAuth };
