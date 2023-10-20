import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { getToken } from './AuthService';

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-curly-newline */

// handle the public routes
function PublicRoute({ component: Component, ...rest }) {

  return getToken()?<Navigate to="/dashboard"/>: <Outlet/>
}

export default PublicRoute;
