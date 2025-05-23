import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Image, Container, Modal, Spinner } from 'react-bootstrap';
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
  const [recompensas, setRecompensas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const [cartaSeleccionada, setCartaSeleccionada] = useState(null);
  const [mostrarModalCarta, setMostrarModalCarta] = useState(false);
  const navigate = useNavigate();
  const { user, login, token } = useAuth();

  useEffect(() => {
    apiGet('user').then(setUsuario).catch(() => setUsuario(null));
    apiGet('torneos').then(setTorneos).catch(() => setTorneos([]));
  }, []);

  useEffect(() => {
    if (usuario?.id) {
      apiGet('perfiles')
        .then(perfiles => {
          const p = perfiles.find(p => p.usuario_id === usuario.id);
          setPerfil(p);
        })
        .catch(() => setPerfil(null));
    }
  }, [usuario?.id]);

  useEffect(() => {
    const cargarRecompensas = async () => {
      try {
        const all = [];
        for (const torneo of torneos) {
          const data = await apiGet(`torneos/${torneo.id}/recompensas`);
          all.push(...data.map(r => ({ ...r, torneo_id: torneo.id })));
        }
        setRecompensas(all);
      } catch (error) {
        console.error('❌ Error al cargar recompensas:', error);
      }
    };

    if (torneos.length > 0) cargarRecompensas();
  }, [torneos]);

  const cambiarAvatar = async (nuevoAvatar) => {
    try {
      await apiPut(`usuarios/${user.id}`, { avatar: nuevoAvatar });
      const usuarioActualizado = await apiGet('user');
      login(usuarioActualizado, token);
      setUsuario(usuarioActualizado);
      setShowModal(false);
    } catch (error) {
      alert('Error al cambiar el avatar');
    }
  };

  const abrirModalInfo = (torneo) => {
    setTorneoSeleccionado(torneo);
    setShowInfo(true);
  };

  const puedeInscribirse = (nuevaFecha, fechasExistentes) => {
    const nueva = new Date(nuevaFecha).toISOString().split('T')[0];
    return !fechasExistentes.some(f => {
      const fSimple = new Date(f).toISOString().split('T')[0];
      return fSimple === nueva;
    });
  };
  

  return (
    <TorneoLayout>
      <Container fluid className="py-4" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
        <h2 className="text-center mb-4" style={{ color: '#fff', fontFamily: 'Cinzel, serif' }}>VISTA GENERAL</h2>
        <Row className="align-items-start">
          {/* Torneos */}
          <Col md={8}>
            <h2 className="mb-4 text-center" style={{ color: '#FFD700', fontFamily: 'Cinzel, serif', fontSize: '2rem' }}>TORNEOS DISPONIBLES</h2>
            {torneos.map((torneo) => {
              const recompensasTorneo = recompensas.filter(r => r.torneo_id === torneo.id);
              return (
                <Card key={torneo.id} className="mb-3" style={{
                  backgroundColor: '#1c1c1c',
                  color: '#F8F4E3',
                  border: '2px solid #B22222',
                  boxShadow: '0 0 10px rgba(178, 34, 34, 0.5)'
                }}>
                  <Card.Body className="text-center">
                    <Card.Title style={{
                      fontWeight: 'bold',
                      fontSize: '1.5rem',
                      color: '#B22222',
                      textTransform: 'uppercase'
                    }}>
                      {torneo.nombre}
                    </Card.Title>
                    <Card.Subtitle className="mb-2" style={{ color: '#fff' }}>
                      {torneo.fecha} — {torneo.formato}
                    </Card.Subtitle>
                    <div className="mt-3 text-start">
                      <strong style={{ color: '#FFD700' }}>Recompensas:</strong>
                      {recompensasTorneo.length > 0 ? (
                        recompensasTorneo.map(r => (
                          <div key={r.id} className="d-flex align-items-center gap-2 mt-2">
                            <img
                              src={r.imagen_url || 'https://via.placeholder.com/40'}
                              alt={r.nombre_carta}
                              style={{ width: 40, height: 56, border: '1px solid #FFD700', cursor: 'pointer' }}
                              onClick={() => {
                                setCartaSeleccionada(r);
                                setMostrarModalCarta(true);
                              }}
                            />
                            <span style={{ color: '#F8F4E3' }}>
                              {r.puesto}º - {r.nombre_carta} ({r.rareza})
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="mt-2" style={{ color: '#ffffff' }}>Sin recompensas</p>
                      )}
                    </div>
                    <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                      <Button variant="outline-warning" size="sm" onClick={() => abrirModalInfo(torneo)}>
                        Ver más info
                      </Button>
                      {torneo.estado === 'inscripcion' && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          disabled={!puedeInscribirse(torneo.fecha, torneos.filter(t => t.inscrito).map(t => t.fecha))}
                        >
                          Apuntarse
                        </Button>
                      )}
                      {torneo.estado === 'activo' && (
                        <Button variant="outline-info" size="sm">Ver emparejamientos</Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </Col>

          {/* Perfil + Foro */}
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
                <p>{usuario?.email}</p>
                <hr />
                <p><strong>Torneos Jugados:</strong> {perfil?.torneos_jugados ?? 0}</p>
                <p><strong>Torneos Ganados:</strong> {perfil?.torneos_ganados ?? 0}</p>
              </Card.Body>
            </Card>
            <Card className="mt-4" style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3', border: '1px solid #FFD700' }}>
              <Card.Body className="text-center">
                <Card.Title style={{ color: '#FFD700', fontWeight: 'bold' }}>FORO GENERAL</Card.Title>
                <p className="small">Participa en las discusiones generales, comenta barajas, sugiere cambios o comparte tus experiencias.</p>
                <Button onClick={() => navigate('/usuario/foro')} style={{ backgroundColor: '#B22222', border: 'none' }} className="w-100">
                  Ir al Foro
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal Avatar */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton style={{ backgroundColor: '#1c1c1c', color: '#FFD700' }}>
            <Modal.Title>Cambiar Avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#1c1c1c' }}>
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

        {/* Modal Imagen Carta */}
        <Modal show={mostrarModalCarta} onHide={() => setMostrarModalCarta(false)} centered size="lg">
          <Modal.Header closeButton style={{ backgroundColor: '#1c1c1c', color: '#FFD700' }}>
            <style>{`.btn-close { filter: invert(1); }`}</style>
            <Modal.Title>{cartaSeleccionada?.nombre_carta}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#1c1c1c', textAlign: 'center' }}>
            {cartaSeleccionada?.imagen_url && (
              <img
                src={cartaSeleccionada.imagen_url}
                alt={cartaSeleccionada.nombre_carta}
                style={{ maxWidth: '100%', borderRadius: '8px', border: '2px solid #FFD700' }}
              />
            )}
            <p className="mt-3 text-light">{cartaSeleccionada?.descripcion || 'Sin descripción'}</p>
          </Modal.Body>
        </Modal>

        {/* Modal Info Torneo */}
        <Modal show={showInfo} onHide={() => setShowInfo(false)} centered>
          <Modal.Header closeButton style={{ backgroundColor: '#1c1c1c', color: '#FFD700' }}>
            <style>{`.btn-close { filter: invert(1); }`}</style>
            <Modal.Title>{torneoSeleccionado?.nombre}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3' }}>
            <p><strong>Formato:</strong> {torneoSeleccionado?.formato}</p>
            <p><strong>Fecha:</strong> {torneoSeleccionado?.fecha}</p>
            <p><strong>Hora:</strong> {torneoSeleccionado?.hora || 'No especificada'}</p>
            <p><strong>Descripción:</strong> {torneoSeleccionado?.descripcion}</p>
          </Modal.Body>
        </Modal>
      </Container>
    </TorneoLayout>
  );
};

export default InicioUsuario;
