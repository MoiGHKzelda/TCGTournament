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

  // Carga inicial: usuario y torneos
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [userData, torneosData] = await Promise.all([
          apiGet('user'),
          apiGet('torneos')
        ]);
        setUsuario(userData);
        setTorneos(torneosData);
      } catch {
        setUsuario(null);
        setTorneos([]);
      }
    };
    cargarDatosIniciales();
  }, []);

  // Perfil e inscripciones cuando usuario cargado
  useEffect(() => {
    if (!usuario?.id) return;

    const cargarPerfilEInscripciones = async () => {
      try {
        const perfiles = await apiGet('perfiles');
        const perfilEncontrado = perfiles.find(p => p.usuario_id === usuario.id) || null;
        setPerfil(perfilEncontrado);
      } catch {
        setPerfil(null);
      }

      try {
        const inscrip = await apiGet('user/torneos');
        setInscripciones(inscrip);
      } catch {
        setInscripciones([]);
      }
    };

    cargarPerfilEInscripciones();
  }, [usuario?.id]);

  // Carga recompensas y jugadores por torneo cuando cambian los torneos
  useEffect(() => {
    if (torneos.length === 0) return;

    const cargarRecompensasYJugadores = async () => {
      try {
        const recompensasPromises = torneos.map(t =>
          apiGet(`torneos/${t.id}/recompensas`).then(data => data.map(r => ({ ...r, torneo_id: t.id })))
        );

        const jugadoresPromises = torneos.map(t =>
          apiGet(`torneos/${t.id}/jugadores`).then(jugadores => ({ torneo_id: t.id, count: jugadores.length }))
        );

        const [recompensasAll, jugadoresAll] = await Promise.all([
          Promise.all(recompensasPromises),
          Promise.all(jugadoresPromises)
        ]);

        setRecompensas(recompensasAll.flat());

        const conteos = {};
        jugadoresAll.forEach(j => {
          conteos[j.torneo_id] = j.count;
        });
        setJugadoresPorTorneo(conteos);
      } catch (e) {
        console.error('Error cargando recompensas o jugadores', e);
      }
    };

    cargarRecompensasYJugadores();
  }, [torneos]);

  // Carga partidas activas del usuario (filtrado) cuando cambian torneos o usuario
  useEffect(() => {
    if (torneos.length === 0 || !usuario) return;

    const cargarPartidasUsuario = async () => {
      try {
        const torneosActivos = torneos.filter(t => t.estado === 'activo');
        const partidasUsuarioAcumuladas = [];

        for (const torneo of torneosActivos) {
          const partidas = await apiGet(`torneos/${torneo.id}/partidas-actuales`);
          partidas.forEach(p => {
            if (p.jugador1.id === usuario.id || p.jugador2?.id === usuario.id) {
              partidasUsuarioAcumuladas.push({ ...p, torneoNombre: torneo.nombre });
            }
          });
        }
        setPartidasUsuario(partidasUsuarioAcumuladas);
      } catch (e) {
        console.error('Error cargando partidas usuario', e);
        setPartidasUsuario([]);
      }
    };

    cargarPartidasUsuario();
  }, [torneos, usuario]);

  // Carga partidas si cambian las inscripciones (más generales)
  useEffect(() => {
    if (torneos.length === 0 || inscripciones.length === 0) return;

    const cargarPartidasGenerales = async () => {
      try {
        const torneosActivos = torneos.filter(t => t.estado === 'activo');
        let partidasTodas = [];

        for (const torneo of torneosActivos) {
          const partidas = await apiGet(`torneos/${torneo.id}/partidas-actuales`);
          partidasTodas = partidasTodas.concat(partidas.map(p => ({ ...p, torneoNombre: torneo.nombre })));
        }
        setPartidasUsuario(partidasTodas);
      } catch (e) {
        console.error('Error cargando partidas generales', e);
        setPartidasUsuario([]);
      }
    };

    cargarPartidasGenerales();
  }, [torneos, inscripciones]);

  // Cambiar avatar
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

  // Check inscripción
  const estaInscrito = (torneoId) => inscripciones.some(t => t.id === torneoId);

  // Inscribirse en torneo
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

  // Desinscribirse de torneo
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

  const abrirModalInfo = (torneo) => {
    setTorneoSeleccionado(torneo);
    setShowInfo(true);
  };

  return (
    <TorneoLayout>
      <Container fluid className="py-5" style={{ backgroundColor: '#121212', color: '#F8F4E3', minHeight: '100vh' }}>
        <h2 className="text-center mb-4" style={{ color: '#FFD700', fontFamily: 'Cinzel, serif' }}>Vista General</h2>
        <Row className="align-items-start">
          <Col md={8} style={{ height: 'calc(100vh - 160px)', overflowY: 'auto', paddingRight: '15px' }}>
            <div style={{ paddingBottom: '100px' }}>
              <h2 className="mb-4 text-center" style={{ color: '#FFD700' }}>TORNEOS DISPONIBLES</h2>
              {torneos.filter(t => t.estado !== 'finalizado').length === 0 ? (
                <div className="text-center mt-4">
                  <h5 style={{ color: '#ccc' }}>⏳ Se están creando los torneos... ¡Vuelve pronto!</h5>
                </div>
              ) : (
                torneos
                  .filter(t => t.estado !== 'finalizado')
                  .sort((a, b) => b.id - a.id)
                  .map(torneo => {
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
                  })
              )}
            </div>
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
                <p><strong>Torneos Jugados:</strong> {perfil?.torneos_jugados ?? 0}</p>
                <p><strong>Torneos Ganados:</strong> {perfil?.torneos_ganados ?? 0}</p>
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
