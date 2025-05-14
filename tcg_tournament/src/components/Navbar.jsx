import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#1C1C1C' }}>
      <div className="container-fluid px-4">
        <NavLink to={token ? '/home' : '/'} className="navbar-brand" style={{ color: '#F8F4E3' }}>
          TCG Tournament
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto">
            {token ? (
              <>
                <li className="nav-item">
                  <span className="nav-link" style={{ color: '#F8F4E3' }}>
                    ¡Hola, {userName}!
                  </span>
                </li>
                <li className="nav-item">
                  <NavLink to="/home" className="nav-link" style={{ color: '#F8F4E3' }}>
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
