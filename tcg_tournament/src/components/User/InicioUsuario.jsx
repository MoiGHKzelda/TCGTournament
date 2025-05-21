// ✅ InicioUsuario.jsx
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Image, Container, Modal } from 'react-bootstrap';
import { apiGet, apiPut } from '../../services/api';
import TorneoLayout from './TorneoLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const avatars = [
  'avatar_1.png', 'avatar_2.png', 'avatar_3.png',
  'avatar_4.png', 'avatar_5.png', 'avatar_6.png',
  'avatar_7.png', 'avatar_8.png', 'avatar_9.png'
];

const InicioUsuario = () => {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [torneos, setTorneos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { user, login, token } = useAuth();

  useEffect(() => {
    apiGet('user')
      .then(setUsuario)
      .catch(() => setUsuario(null));

    apiGet('torneos')
      .then(setTorneos)
      .catch(() => setTorneos([]));
  }, []);

  useEffect(() => {
    if (usuario?.id) {
      apiGet('perfiles')
        .then((perfiles) => {
          const p = perfiles.find(p => p.usuario_id === usuario?.id);
          setPerfil(p);
        })
        .catch(() => setPerfil(null));
    }
  }, [usuario?.id]);

  const cambiarAvatar = async (nuevoAvatar) => {
    try {
      await apiPut(`usuarios/${user.id}`, { avatar: nuevoAvatar });
      const usuarioActualizado = await apiGet('user');
      login(usuarioActualizado, token);
      setUsuario(usuarioActualizado);
      setShowModal(false);
    } catch (error) {
      console.error('❌ Error al cambiar el avatar:', error);
      alert('Error al cambiar el avatar');
    }
  };

  return (
    <TorneoLayout>
      <Container fluid className="py-4" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
        <h2 className="text-center mb-4" style={{ color: '#fff', fontFamily: 'Cinzel, serif' }}>VISTA GENERAL</h2>
        <Row className="align-items-start">
          {/* Torneos */}
          <Col md={8}>
            <h2 className="mb-4 text-center" style={{ color: '#FFD700', fontFamily: 'Cinzel, serif', fontSize: '2rem' }}>TORNEOS DISPONIBLES</h2>
            {torneos.map((torneo) => (
              <Card key={torneo.id} className="mb-3" style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3', border: '1px solid #FFD700' }}>
                <Card.Body className="text-center">
                  <Card.Title style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{torneo.nombre}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{torneo.fecha} — {torneo.formato}</Card.Subtitle>
                  <Card.Text>{torneo.descripcion}</Card.Text>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {torneo.estado === 'inscripcion' && (
                      <Button variant="outline-success" size="sm">Apuntarse</Button>
                    )}
                    {torneo.estado === 'activo' && (
                      <Button variant="outline-info" size="sm">Ver Emparejamientos</Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Col>

          {/* Perfil + Foros */}
          <Col md={4}>
            <Card style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3', border: '1px solid #FFD700' }}>
              <Card.Body className="text-center">
                <Image
                  src={`/img/${usuario?.avatar || 'avatar_1.png'}`}
                  roundedCircle
                  width={90}
                  style={{ cursor: 'pointer', border: '2px solid #B22222' }}
                  onClick={() => setShowModal(true)}
                />
                <h5 className="mt-2">{usuario?.nombre?.toUpperCase()}</h5>
                <p style={{ color: '#F8F4E3' }}>{usuario?.email}</p>
                <hr />
                <p><strong>Torneos Jugados:</strong> {perfil?.torneos_jugados ?? 0}</p>
                <p><strong>Torneos Ganados:</strong> {perfil?.torneos_ganados ?? 0}</p>
              </Card.Body>
            </Card>

            <Card className="mt-4" style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3', border: '1px solid #FFD700' }}>
              <Card.Body className="text-center">
                <Card.Title style={{ color: '#FFD700', fontWeight: 'bold' }}>FORO GENERAL</Card.Title>
                <p className="small">
                  Participa en las discusiones generales, comenta barajas, sugiere cambios, o comparte tus experiencias en torneos.
                </p>
                <Button
                  onClick={() => navigate('/usuario/foro')}
                  style={{ backgroundColor: '#B22222', border: 'none' }}
                  className="w-100"
                >
                  Ir al Foro
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal para elegir avatar */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton style={{ backgroundColor: '#1c1c1c', color: '#FFD700', borderBottom: '1px solid #FFD700' }} closeVariant="white">
            <Modal.Title>Cambiar Avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#1c1c1c', border: '1px solid #FFD700' }}>
            <Row>
              {avatars.map((a, i) => (
                <Col xs={4} className="text-center mb-3" key={i}>
                  <Image
                    src={`/img/${a}`}
                    roundedCircle
                    width={80}
                    style={{
                      cursor: 'pointer',
                      border: usuario?.avatar === a ? '2px solid #FFD700' : '2px solid transparent'
                    }}
                    onClick={() => cambiarAvatar(a)}
                  />
                </Col>
              ))}
            </Row>
          </Modal.Body>
        </Modal>
      </Container>
    </TorneoLayout>
  );
};

export default InicioUsuario;
