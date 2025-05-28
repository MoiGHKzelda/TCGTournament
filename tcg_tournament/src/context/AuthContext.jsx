import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../services/api'; // Asegúrate que esta función haga la petición a /api/user

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (tokenGuardado && usuarioGuardado) {
      setToken(tokenGuardado);
      setUser(JSON.parse(usuarioGuardado));
      setLoading(false);
    } else if (tokenGuardado) {
      setToken(tokenGuardado);
      getUser()
        .then((data) => {
          setUser(data);
          localStorage.setItem('usuario', JSON.stringify(data));
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (usuarioData, tokenValue) => {
    setUser(usuarioData);
    setToken(tokenValue);
    localStorage.setItem('usuario', JSON.stringify(usuarioData));
    localStorage.setItem('token', tokenValue);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
