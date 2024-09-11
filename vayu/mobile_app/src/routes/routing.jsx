import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  if (
    localStorage.getItem('access_token') &&
    localStorage.getItem('refresh_token')
  ) {
    return <Navigate to={'/home'} />;
  }
  return children;
};

const PrivateRoute = ({ children }) => {
  //   const roleSelected = useSelector(selectRole);
  if (
    !localStorage.getItem('access_token') ||
    !localStorage.getItem('refresh_token')
  ) {
    return <Navigate to={'/'} />;
  }
  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.any,
};

PrivateRoute.propTypes = {
  children: PropTypes.any,
};

export { PrivateRoute, PublicRoute };
