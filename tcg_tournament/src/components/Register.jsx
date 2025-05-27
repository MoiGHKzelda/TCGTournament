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
  const esTextoValido = (texto) => texto.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroresValidacion({});
    setError('');
    setMensaje('');
    if (!esTextoValido(nombre)) {
      setErroresValidacion({ nombre: 'El nombre no puede estar vacío o con solo espacios.' });
      return;
    }
    
    if (!esTextoValido(email)) {
      setErroresValidacion({ email: 'El correo electrónico no puede estar vacío o con espacios.' });
      return;
    }
    
    if (!esTextoValido(password)) {
      setErroresValidacion({ password: 'La contraseña no puede estar vacía o con espacios.' });
      return;
    }
    
    if (!esTextoValido(dni)) {
      setErroresValidacion({ dni: 'El DNI no puede estar vacío o con espacios.' });
      return;
    }
    
  
    if (!validarTelefono(telefono)) {
      setErroresValidacion({ telefono: 'El teléfono debe tener exactamente 9 dígitos.' });
      return;
    }
  
    if (!validarDni(dni)) {
      setErroresValidacion({ dni: 'El DNI debe tener 8 números seguidos de una letra. Ej: 12345678A' });
      return;
    }
  
    try {
      const response = await postRegister({ nombre, email, password, telefono, dni });
  
      // Asegúrate de que hubo respuesta 201
      if (response?.usuario || response?.user) {
        navigate('/', {
          replace: true,
          state: { registroExitoso: true }
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.log("Errores de validación desde el backend:", error.response.data);
        const validationErrors = error.response.data.errors;
        const nuevosErrores = {};
    
        if (validationErrors) {
          for (const campo in validationErrors) {
            nuevosErrores[campo] = validationErrors[campo][0];
          }
        }
    
        setErroresValidacion(nuevosErrores);
        setError('Corrige los errores antes de continuar.');
      } else {
        setError(error.message || 'Error al registrar');
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
                  {erroresValidacion.nombre && (
                    <Form.Text className="text-danger">{erroresValidacion.nombre}</Form.Text>
                  )}
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
                  {erroresValidacion.email && (
                    <Form.Text className="text-danger">{erroresValidacion.email}</Form.Text>
                  )}
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
                  {erroresValidacion.telefono && (
                    <Form.Text className="text-danger">{erroresValidacion.telefono}</Form.Text>
                  )}
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
                  {erroresValidacion.dni && (
                    <Form.Text className="text-danger">{erroresValidacion.dni}</Form.Text>
                  )}
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className={`bg-dark text-light border-secondary ${erroresValidacion.password ? 'border-danger' : ''}`}
                  />
                  {erroresValidacion.password && (
                    <Form.Text className="text-danger">{erroresValidacion.password}</Form.Text>
                  )}
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
