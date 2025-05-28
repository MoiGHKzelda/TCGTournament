import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { Navigate, Link, useLocation } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { useAuth } from '../context/AuthContext';
import { postLogin } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();

  const location = useLocation();
  const [registroExitoso, setRegistroExitoso] = useState(false);

  useEffect(() => {
    if (location.state?.registroExitoso) {
      setRegistroExitoso(true);
      const timer = setTimeout(() => setRegistroExitoso(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');
    try {
      const data = await postLogin(email, password);
      login(data.user, data.access_token);
    } catch (error) {
      // El error puede ser una instancia de Error con message
      setMensaje(error.message || 'Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
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

              {registroExitoso && (
                <Alert variant="success">
                  ✅ Usuario registrado con éxito. Ya puedes iniciar sesión.
                </Alert>
              )}

              {mensaje && (
                <Alert variant="danger" onClose={() => setMensaje('')} dismissible>
                  ❌ {mensaje}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setRegistroExitoso(false); }}
                    required
                    className="bg-dark text-light border-secondary"
                    disabled={loading}
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
                    disabled={loading}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-100 py-2"
                  style={{ backgroundColor: '#B22222', border: 'none' }}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
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
