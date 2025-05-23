import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  if (loading) return null;
  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#1C1C1C' }}>
      <div className="container-fluid px-4">
        <NavLink to={user ? '/home' : '/'} className="navbar-brand" style={{ color: '#F8F4E3' }}>
          TCG Tournament
        </NavLink>
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                {user?.nombre && (
                  <li className="nav-item">
                    <span className="nav-link" style={{ color: '#F8F4E3' }}>
                      ¡Hola, {user.nombre}!
                    </span>
                  </li>
                )}
                <li className="nav-item">
                <NavLink to={user?.rol === 'admin' ? '/admin/dashboard' : '/usuario/inicio'} className="nav-link" style={{ color: '#F8F4E3' }}>
                  Inicio
                </NavLink>

                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-danger">
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/" className="nav-link" style={{ color: '#F8F4E3' }}>
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link" style={{ color: '#F8F4E3' }}>
                    Registro
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
