const isLoggedIn = (user) => !!user; // returns true or false dpending on if user exists. !!user is same as boolean(user)

const isAdmin = (user) => user?.role === 'admin';

export { isLoggedIn, isAdmin };
