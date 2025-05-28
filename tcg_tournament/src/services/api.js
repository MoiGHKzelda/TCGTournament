const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem('token');

const headers = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Obtener el usuario actual
export const getUser = async () => {
  const res = await fetch(`${API_URL}/api/user`, {
    method: 'GET',
    headers: headers(),
  });
  if (!res.ok) throw new Error('No autenticado');
  return res.json();
};

// Login
export const postLogin = async (email, password) => {
  const res = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login fallido');
  return data;
};

// Registro
export const postRegister = async (formData) => {
  const res = await fetch(`${API_URL}/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || 'Registro fallido');
    error.response = { status: res.status, data };
    throw error;
  }
  return data;
};

// Petición genérica GET
export const apiGet = async (url) => {
  const res = await fetch(`${API_URL}/api/${url}`, {
    method: 'GET',
    headers: headers(),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('❌ Error en apiGet:', data);
    throw new Error(data.message || 'Error al obtener datos');
  }
  return data;
};

// Petición genérica POST
export const apiPost = async (url, body = {}) => {
  const res = await fetch(`${API_URL}/api/${url}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error en POST');
  return data;
};

// Petición genérica DELETE
export const apiDelete = async (url) => {
  const res = await fetch(`${API_URL}/api/${url}`, {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok) throw new Error('Error al eliminar');
  const text = await res.text();
  return text ? JSON.parse(text) : {};
};

// Petición genérica PUT
export const apiPut = async (url, body) => {
  const res = await fetch(`${API_URL}/api/${url}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error en la petición PUT');
  }
  return await res.json();
};
