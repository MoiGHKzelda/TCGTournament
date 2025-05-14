import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      console.log('Login correcto:', data);
      setMensaje('Inicio de sesión exitoso');

      // localStorage.setItem('token', data.token); // si se usa token
      navigate('/');

    } catch (error) {
      setMensaje(error.message);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100" style={{ maxWidth: '400px' }}>
        <Col>
          <h2 className="text-center mb-4" style={{ color: '#B22222' }}>Iniciar Sesión</h2>
          {mensaje && <Alert variant="danger">{mensaje}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email" className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group id="password" className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <Button type="submit" className="w-100" style={{ backgroundColor: '#B22222', border: 'none' }}>
              Iniciar sesión
            </Button>
          </Form>
          <div className="text-center mt-3">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
