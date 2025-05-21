import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { useAuth } from '../context/AuthContext';
import { postLogin } from '../services/api';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const { login, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await postLogin(email, password);
      login(data.usuario, data.token);
    } catch (error) {
      setMensaje(error.message);
    }
  };

  if (user) {
    const destino = user.rol === 'admin' ? '/admin/dashboard' : '/usuario/inicio';
    return <Navigate to={destino} replace />;
  }


  return (
    <AuthLayout>
      <Row className="justify-content-center w-100 px-3">
        <Col xs={12} sm={10} md={6} lg={4}>
          <Card className="shadow-lg border border-danger rounded-4 px-3 py-4" style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3' }}>
            <Card.Body>
              <h2 className="text-center mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Iniciar Sesión</h2>
              {mensaje && <Alert variant="danger">{mensaje}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-dark text-light border-secondary"
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-dark text-light border-secondary"
                  />
                </Form.Group>
                <Button type="submit" className="w-100 py-2" style={{ backgroundColor: '#B22222', border: 'none' }}>
                  Entrar
                </Button>
              </Form>
              <div className="text-center mt-3">
                ¿No tienes cuenta? <Link to="/register" style={{ color: '#FFD700' }}>Regístrate</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AuthLayout>
  );
};

export default Login;
