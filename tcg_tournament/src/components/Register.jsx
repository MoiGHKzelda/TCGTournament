import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
      });

      if (!response.ok) throw new Error('No se pudo registrar el usuario');
      console.log('🟡 Enviando:', { nombre, email, password });
      setMensaje('Usuario registrado con éxito');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      setMensaje(error.message);
    }
  };

  return (
    <AuthLayout>
      <Row className="justify-content-center w-100 px-3">
        <Col xs={12} sm={10} md={6} lg={4}>
          <Card className="shadow-lg border border-danger rounded-4 px-3 py-4" style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3' }}>
            <Card.Body>
              <h2 className="text-center mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Registro</h2>
              {mensaje && <Alert variant="info">{mensaje}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" value={nombre} onChange={e => setNombre(e.target.value)} required className="bg-dark text-light border-secondary" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-dark text-light border-secondary" />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required className="bg-dark text-light border-secondary" />
                </Form.Group>
                <Button type="submit" className="w-100 py-2" style={{ backgroundColor: '#B22222', border: 'none' }}>
                  Registrarse
                </Button>
              </Form>
              <div className="text-center mt-3">
                ¿Ya tienes cuenta? <Link to="/" style={{ color: '#FFD700' }}>Inicia sesión</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AuthLayout>
  );
};

export default Register;
