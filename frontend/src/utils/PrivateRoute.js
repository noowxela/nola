import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from './AuthService';


/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-curly-newline */

// handle the private routes
function PrivateRoute({ component: Component, ...rest }) {
  
  return getToken()?<Outlet/>: <Navigate to="/login"/>
}

export default PrivateRoute;
