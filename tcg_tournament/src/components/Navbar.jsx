import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return null;

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: '#121212',
        color: '#F8F4E3',
        padding: '10px 20px',
        borderBottom: '1px solid #FFD700',
        overflowX: 'hidden'
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div
          className="d-flex align-items-center"
          style={{ cursor: 'default' }}
          onClick={(e) => e.preventDefault()}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ height: '50px', marginRight: '12px' }} 
          />
          <span
            style={{
              color: '#FFD700',
              fontFamily: 'Cinzel, serif',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            TCG Tournament
          </span>
        </div>

        <ul className="navbar-nav d-flex flex-row gap-3 align-items-center m-0">
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
                <NavLink
                  to={user?.rol === 'admin' ? '/admin/dashboard' : '/usuario/inicio'}
                  className="nav-link"
                  style={{ color: '#F8F4E3' }}
                >
                  Inicio
                </NavLink>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={handleLogout}>
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
    </nav>
  );
};

export default Navbar;
