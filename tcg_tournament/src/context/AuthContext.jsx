// ✅ AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token');
    if (tokenGuardado) {
      getUser()
        .then(data => {
          setUser(data);
          setToken(tokenGuardado);
          localStorage.setItem('usuario', JSON.stringify(data));
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);


  const login = (usuarioData, token) => {
    setUser(usuarioData);
    setToken(token);
    localStorage.setItem('usuario', JSON.stringify(usuarioData));
    localStorage.setItem('token', token);
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
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
