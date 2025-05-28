import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { postRegister } from '../services/api';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dni, setDni] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [erroresValidacion, setErroresValidacion] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validarTelefono = (numero) => /^[0-9]{9}$/.test(numero);
  const validarDni = (valor) => /^[0-9]{8}[A-Za-z]$/.test(valor);

  const esTextoValido = (texto) => texto.trim().length > 0;

  const isFormValid =
    esTextoValido(nombre) &&
    esTextoValido(email) &&
    esTextoValido(password) &&
    validarTelefono(telefono) &&
    validarDni(dni);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroresValidacion({});
    setError('');
    setMensaje('');
    setLoading(true);

    // Validaciones cliente, agrupadas para mostrar todos errores a la vez
    const nuevosErrores = {};
    if (!esTextoValido(nombre)) nuevosErrores.nombre = 'El nombre no puede estar vacío.';
    if (!esTextoValido(email)) nuevosErrores.email = 'El correo no puede estar vacío.';
    if (!esTextoValido(password)) nuevosErrores.password = 'La contraseña no puede estar vacía.';
    if (!validarTelefono(telefono)) nuevosErrores.telefono = 'El teléfono debe tener exactamente 9 dígitos.';
    if (!validarDni(dni)) nuevosErrores.dni = 'El DNI debe tener 8 números seguidos de una letra. Ej: 12345678A';

    if (Object.keys(nuevosErrores).length > 0) {
      setErroresValidacion(nuevosErrores);
      setLoading(false);
      return;
    }

    try {
      const response = await postRegister({ nombre, email, password, telefono, dni });
      if (response?.usuario || response?.user) {
        setMensaje('Registro exitoso. Redirigiendo al login...');
        setTimeout(() => {
          navigate('/', { replace: true, state: { registroExitoso: true } });
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors || {};
        const backendErrores = {};
        for (const campo in validationErrors) {
          backendErrores[campo] = validationErrors[campo][0];
        }
        setErroresValidacion(backendErrores);
        setError('Corrige los errores antes de continuar.');
      } else {
        setError(error.message || 'Error al registrar');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Row className="justify-content-center w-100 px-3">
        <Col xs={12} sm={10} md={6} lg={4}>
          <Card
            className="shadow-lg border border-danger rounded-4 px-3 py-4"
            style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3' }}
          >
            <Card.Body>
              <h2 className="text-center mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                Registro
              </h2>
              {mensaje && <Alert variant="success">{mensaje}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label>Nickname</Form.Label>
                  <Form.Control
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    isInvalid={!!erroresValidacion.nombre}
                    disabled={loading}
                    className="bg-dark text-light border-secondary"
                  />
                  <Form.Control.Feedback type="invalid">{erroresValidacion.nombre}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!erroresValidacion.email}
                    disabled={loading}
                    className="bg-dark text-light border-secondary"
                  />
                  <Form.Control.Feedback type="invalid">{erroresValidacion.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    isInvalid={!!erroresValidacion.telefono}
                    disabled={loading}
                    className="bg-dark text-light border-secondary"
                  />
                  <Form.Control.Feedback type="invalid">{erroresValidacion.telefono}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    isInvalid={!!erroresValidacion.dni}
                    disabled={loading}
                    className="bg-dark text-light border-secondary"
                  />
                  <Form.Control.Feedback type="invalid">{erroresValidacion.dni}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!erroresValidacion.password}
                    disabled={loading}
                    className="bg-dark text-light border-secondary"
                  />
                  <Form.Control.Feedback type="invalid">{erroresValidacion.password}</Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="w-100 py-2"
                  style={{ backgroundColor: '#B22222', border: 'none' }}
                >
                  {loading ? 'Registrando...' : 'Registrarse'}
                </Button>
              </Form>

              <div className="text-center mt-3">
                ¿Ya tienes cuenta?{' '}
                <Link to="/" style={{ color: '#FFD700' }}>
                  Inicia sesión
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AuthLayout>
  );
};

export default Register;
