import React, { useState } from 'react';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    nickname: '',
    password: '',
    password_confirmation: '',
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors({});

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setForm({
          name: '',
          email: '',
          nickname: '',
          password: '',
          password_confirmation: '',
        });
      } else {
        const errorData = await response.json();
        setErrors(errorData);
      }
    } catch (error) {
      setMessage('Error en el servidor.');
    }
  };

  return (
    <div className="register-form">
      <h2>Registrarse</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p style={{ color: 'red' }}>{errors.name[0]}</p>}
        </div>

        <div>
          <label>Correo electrónico</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
          {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}
        </div>

        <div>
          <label>Nickname</label>
          <input type="text" name="nickname" value={form.nickname} onChange={handleChange} />
          {errors.nickname && <p style={{ color: 'red' }}>{errors.nickname[0]}</p>}
        </div>

        <div>
          <label>Contraseña</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
          {errors.password && <p style={{ color: 'red' }}>{errors.password[0]}</p>}
        </div>

        <div>
          <label>Confirmar contraseña</label>
          <input
            type="password"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
