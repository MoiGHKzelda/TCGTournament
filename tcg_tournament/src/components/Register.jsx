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
  const navigate = useNavigate();

  const validarTelefono = (numero) => /^[0-9]{9}$/.test(numero);
  const validarDni = (valor) => /^[0-9]{8}[A-Za-z]$/.test(valor);

  const isFormValid = validarTelefono(telefono) && validarDni(dni);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroresValidacion({});

    if (!validarTelefono(telefono)) {
      setError('El teléfono debe tener exactamente 9 dígitos.');
      setErroresValidacion({ telefono: true });
      return;
    }

    if (!validarDni(dni)) {
      setError('El DNI debe tener 8 números seguidos de una letra. Ej: 12345678A');
      setErroresValidacion({ dni: true });
      return;
    }

    try {
      await postRegister({ nombre, email, password, telefono, dni });
      setMensaje('Usuario registrado con éxito');
      setError('');
      setErroresValidacion({});
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        let nuevosErrores = {};

        if (validationErrors) {
          if (validationErrors.email) {
            setError('El correo electrónico ya está registrado.');
            nuevosErrores.email = true;
          } else if (validationErrors.nombre) {
            setError('El nombre ya está en uso, por favor elige otro.');
            nuevosErrores.nombre = true;
          } else if (validationErrors.dni) {
            setError('El DNI ya está registrado.');
            nuevosErrores.dni = true;
          } else {
            setError('Error de validación en los datos proporcionados.');
          }

          setErroresValidacion(nuevosErrores);
        }
      } else {
        setError(error.message || 'Registro fallido');
      }
    }
  };

  return (
    <AuthLayout>
      <Row className="justify-content-center w-100 px-3">
        <Col xs={12} sm={10} md={6} lg={4}>
          <Card className="shadow-lg border border-danger rounded-4 px-3 py-4" style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3' }}>
            <Card.Body>
              <h2 className="text-center mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Registro</h2>
              {mensaje && <Alert variant="success">{mensaje}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nickname</Form.Label>
                  <Form.Control
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    required
                    className={`bg-dark text-light border-secondary ${erroresValidacion.nombre ? 'border-danger' : ''}`}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className={`bg-dark text-light border-secondary ${erroresValidacion.email ? 'border-danger' : ''}`}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    value={telefono}
                    onChange={e => setTelefono(e.target.value)}
                    required
                    className={`bg-dark text-light border-secondary ${erroresValidacion.telefono ? 'border-danger' : ''}`}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control
                    type="text"
                    value={dni}
                    onChange={e => setDni(e.target.value)}
                    required
                    className={`bg-dark text-light border-secondary ${erroresValidacion.dni ? 'border-danger' : ''}`}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="bg-dark text-light border-secondary"
                  />
                </Form.Group>
                <Button type="submit" disabled={!isFormValid} className="w-100 py-2" style={{ backgroundColor: '#B22222', border: 'none' }}>
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
