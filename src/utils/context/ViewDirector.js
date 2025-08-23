/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useAuth } from '@/utils/context/authContext';
import Loading from '@/components/Loading';
import NavBar from '@/components/NavBar';

function ViewDirectorBasedOnUserAuthStatus({ children }) {
  const { user, userLoading } = useAuth();

  // if user state is null, then show loader
  if (userLoading) {
    return <Loading />; // shows until firebase state resolves
  }

  return (
    <>
      <NavBar /> {/* NavBar only visible if user is logged in and is in every view */}
      {children}
    </>
  );
}

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  children: PropTypes.node.isRequired,
};
