import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/Admin/AdminDashboard';
import InicioUsuario from './components/User/InicioUsuario';
import ForoGeneral from './components/User/ForoGeneral';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { user } = useAuth();
  const location = useLocation();

  const PublicRoute = ({ children }) => {
    if (user) {
      const destino = user.rol === 'admin' ? '/admin/dashboard' : '/usuario/inicio';
      if (location.pathname !== destino) {
        return <Navigate to={destino} replace />;
      }
      return null;
    }

    return children;
  };

  const PrivateRoute = ({ children, rol }) => {
    if (!user) return <Navigate to="/" />;
    if (rol && user.rol !== rol) return <Navigate to="/" />;
    return children;
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/admin/dashboard" element={
          <PrivateRoute rol="admin">
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/usuario/inicio" element={
          <PrivateRoute rol="jugador">
            <InicioUsuario />
          </PrivateRoute>
        } />
        <Route
          path="/usuario/foro"
          element={
            <PrivateRoute rol="jugador">
              <ForoGeneral />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
