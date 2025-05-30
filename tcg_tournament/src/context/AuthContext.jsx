import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('usuario');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Solo si hay token y no hay user en memoria
  useEffect(() => {
    if (token && !user) {
      getUser()
        .then(data => {
          setUser(data);
          localStorage.setItem('usuario', JSON.stringify(data));
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  // Memoizar login para evitar recreación en cada render
  const login = useCallback((usuarioData, token) => {
    setUser(usuarioData);
    setToken(token);
    localStorage.setItem('usuario', JSON.stringify(usuarioData));
    localStorage.setItem('token', token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    navigate('/');
  }, [navigate]);

  // Memoizar el contexto para evitar renders innecesarios
  const value = useMemo(() => ({
    user,
    token,
    login,
    logout,
    loading
  }), [user, token, login, logout, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
