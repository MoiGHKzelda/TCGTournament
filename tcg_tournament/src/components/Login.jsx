import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Completa todos los campos");

    try {
      // Simula login
      if (email === "test@test.com" && password === "1234") {
        setAuth(true);
        navigate("/home");
      } else {
        setError("Credenciales inválidas");
      }
    } catch {
      setError("Error al iniciar sesión");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form card shadow p-4">
        <h2 className="mb-3 text-center">Iniciar Sesión</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <button className="btn btn-danger w-100">Entrar</button>
        <p className="mt-3 text-center">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
