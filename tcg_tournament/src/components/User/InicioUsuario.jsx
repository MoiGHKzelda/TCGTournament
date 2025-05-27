import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Image, Container, Modal } from 'react-bootstrap';
import { apiGet, apiPut, apiPost } from '../../services/api';
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
  const [inscripciones, setInscripciones] = useState([]);
  const [recompensas, setRecompensas] = useState([]);
  const [jugadoresPorTorneo, setJugadoresPorTorneo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const [cartaSeleccionada, setCartaSeleccionada] = useState(null);
  const [mostrarModalCarta, setMostrarModalCarta] = useState(false);
  const [partidasUsuario, setPartidasUsuario] = useState([]);

  const navigate = useNavigate();
  const { user, login, token } = useAuth();

  // 1. Cargar usuario y torneos al montar el componente
useEffect(() => {
  apiGet('user').then(setUsuario).catch(() => setUsuario(null));
  apiGet('torneos').then(setTorneos).catch(() => setTorneos([]));
}, []);

// 2. Cargar perfil e inscripciones del usuario cuando se tenga el usuario
useEffect(() => {
  if (usuario?.id) {
    apiGet('perfiles')
      .then(perfiles => {
        const p = perfiles.find(p => p.usuario_id === usuario.id);
        setPerfil(p);
      })
      .catch(() => setPerfil(null));

    apiGet('user/torneos')
      .then(setInscripciones)
      .catch(() => setInscripciones([]));
  }
}, [usuario?.id]);

// 3. Cargar recompensas y conteo de jugadores por torneo
useEffect(() => {
  const fetchRecompensasYJugadores = async () => {
    const all = [];
    const counts = {};
    for (const torneo of torneos) {
      const recomp = await apiGet(`torneos/${torneo.id}/recompensas`);
      const jugadores = await apiGet(`torneos/${torneo.id}/jugadores`);
      all.push(...recomp.map(r => ({ ...r, torneo_id: torneo.id })));
      counts[torneo.id] = jugadores.length;
    }
    setRecompensas(all);
    setJugadoresPorTorneo(counts);
  };

  if (torneos.length > 0) fetchRecompensasYJugadores();
}, [torneos]);

// 4. Cargar partidas activas del usuario cuando haya torneos y usuario
useEffect(() => {
  const cargarPartidas = async () => {
    const activas = torneos.filter(t => t.estado === 'activo');
    const partidasTodas = [];

    for (const torneo of activas) {
      const partidas = await apiGet(`torneos/${torneo.id}/partidas-actuales`);
      partidas.forEach(p => {
        if (p.jugador1.id === usuario.id || p.jugador2?.id === usuario.id) {
          partidasTodas.push({ ...p, torneoNombre: torneo.nombre });
        }
      });
    }

    setPartidasUsuario(partidasTodas);
  };

  if (torneos.length > 0 && usuario) cargarPartidas();
}, [torneos, usuario]);

// 5. Cargar partidas si cambian las inscripciones 
useEffect(() => {
  const cargarPartidas = async () => {
    const activas = torneos.filter(t => t.estado === 'activo');
    const partidasTodas = [];

    for (const torneo of activas) {
      const partidas = await apiGet(`torneos/${torneo.id}/partidas-actuales`);
      partidasTodas.push(...partidas.map(p => ({ ...p, torneoNombre: torneo.nombre })));
    }

    setPartidasUsuario(partidasTodas);
  };

  if (inscripciones.length > 0) cargarPartidas();
}, [torneos, inscripciones]);


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
  
  const estaInscrito = (torneoId) => inscripciones.some(t => t.id === torneoId);

  const handleApuntarse = async (torneoId) => {
    try {
      await apiPost(`torneos/${torneoId}/inscribirse`);
      const actualizadas = await apiGet('user/torneos');
      setInscripciones(actualizadas);
      const jugadores = await apiGet(`torneos/${torneoId}/jugadores`);
      setJugadoresPorTorneo(prev => ({ ...prev, [torneoId]: jugadores.length }));
    } catch (error) {
      if (error?.response?.status === 403) {
        alert("No hay plazas disponibles para este torneo.");
      } else {
        alert('Error al inscribirse');
      }
    }
  };

  const handleDesinscribirse = async (torneoId) => {
    try {
      await apiPost(`torneos/${torneoId}/desinscribirse`);
      const actualizadas = await apiGet('user/torneos');
      setInscripciones(actualizadas);
      const jugadores = await apiGet(`torneos/${torneoId}/jugadores`);
      setJugadoresPorTorneo(prev => ({ ...prev, [torneoId]: jugadores.length }));
    } catch {
      alert('❌ Error al desinscribirse');
    }
  };
  useEffect(() => {
    apiGet('user').then(data => {
      setUsuario(data);
    }).catch(() => setUsuario(null));
  }, []);
  

  const abrirModalInfo = (torneo) => {
    setTorneoSeleccionado(torneo);
    setShowInfo(true);
  };

  return (
    <TorneoLayout>
      <Container fluid className="py-5" style={{ backgroundColor: '#121212', color: '#F8F4E3', minHeight: '100vh' }}>
        <h2 className="text-center mb-4" style={{ color: '#FFD700', fontFamily: 'Cinzel, serif' }}>Vista General</h2>
        <Row className="align-items-start">
          <Col md={8}>
            <h2 className="mb-4 text-center" style={{ color: '#FFD700' }}>TORNEOS DISPONIBLES</h2>
            {torneos.map(torneo => {
              const inscritos = jugadoresPorTorneo[torneo.id] || 0;
              const maximo = torneo.max_jugadores || 8;
              const recompensasTorneo = recompensas.filter(r => r.torneo_id === torneo.id);

              return (
                <Card key={torneo.id} className="mb-3" style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3', border: '2px solid #B22222' }}>
                  <Card.Body className="text-center">
                    <Card.Title style={{ color: '#B22222' }}>{torneo.nombre}</Card.Title>
                    <Card.Subtitle style={{ color: '#fff' }}>{torneo.fecha} — {torneo.formato}</Card.Subtitle>
                    <p>{inscritos}/{maximo} jugadores apuntados</p>
                    <div>
                      <strong style={{ color: '#FFD700' }}>Recompensas:</strong>
                      {recompensasTorneo.length > 0 ? (
                        recompensasTorneo.map(r => (
                          <div key={r.id} className="d-flex align-items-center justify-content-center gap-2 mt-2">
                            <img
                              src={r.imagen_url || 'https://via.placeholder.com/40'}
                              alt={r.nombre_carta}
                              style={{ width: 40, height: 56, border: '1px solid #FFD700', cursor: 'pointer' }}
                              onClick={() => {
                                setCartaSeleccionada(r);
                                setMostrarModalCarta(true);
                              }}
                            />
                            <span>{r.puesto}º - {r.nombre_carta} ({r.rareza})</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-light">Sin recompensas</p>
                      )}
                    </div>
                    <div className="mt-3">
                      <Button variant="outline-warning" size="sm" onClick={() => abrirModalInfo(torneo)}>Ver más info</Button>{' '}
                      {torneo.estado === 'inscripcion' && (
                        estaInscrito(torneo.id) ? (
                          <Button variant="outline-danger" size="sm" onClick={() => handleDesinscribirse(torneo.id)}>
                            Desinscribirse
                          </Button>
                        ) : inscritos < maximo ? (
                          <Button variant="outline-success" size="sm" onClick={() => handleApuntarse(torneo.id)}>
                            Apuntarse
                          </Button>
                        ) : (
                          <span className="text-danger fw-bold">Cupo completo</span>
                        )
                      )}
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </Col>
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
                <p><strong>Torneos Jugados:</strong> {usuario?.perfil?.torneos_jugados ?? 0}</p>
                <p><strong>Torneos Ganados:</strong> {usuario?.perfil?.torneos_ganados ?? 0}</p>
              </Card.Body>
            </Card>

            <Card className="mt-4" style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3', border: '1px solid #FFD700' }}>
              <Card.Body className="text-center">
                <Card.Title style={{ color: '#FFD700' }}>FORO GENERAL</Card.Title>
                <p>Participa en el foro compartiendo barajas, estrategias o dudas.</p>
                <Button className="w-100" style={{ backgroundColor: '#B22222', border: 'none' }} onClick={() => navigate('/usuario/foro')}>
                  Ir al Foro
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal Avatar */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: '#1c1c1c',
            color: '#FFD700',
            borderBottom: '1px solid #FFD700',
          }}
        >
          <style>{`.btn-close { filter: invert(1); }`}</style>
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
                    border: usuario?.avatar === a ? '3px solid #FFD700' : '2px solid transparent',
                    transition: 'border 0.2s'
                  }}
                  onClick={() => cambiarAvatar(a)}
                />
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>



        {/* Modal Carta */}
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
            <p><strong>Hora:</strong> {torneoSeleccionado?.hora}</p>
            <p><strong>Descripción:</strong> {torneoSeleccionado?.descripcion}</p>
          </Modal.Body>
        </Modal>
      </Container>
    </TorneoLayout>
  );
};

export default InicioUsuario;
