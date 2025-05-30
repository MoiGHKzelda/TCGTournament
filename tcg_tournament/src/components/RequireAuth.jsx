import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RequireAuth = ({ children, rol }) => {
  const { usuario, token } = useAuth();

  if (!token || !usuario) {
    return <Navigate to="/" />;
  }

  if (rol && usuario.rol !== rol) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RequireAuth;
