import React, { useEffect, useState, useCallback } from 'react';
import {
  Button, Col, Row, Card, Container,
  Toast, ToastContainer, ListGroup, Modal, Form
} from 'react-bootstrap';
import TorneoLayout from '../User/TorneoLayout';
import FormularioTorneo from './FormularioTorneo';
import { apiGet, apiDelete, apiPut, apiPost } from '../../services/api';
import MdlRecompensa from './MdlRecompensa';

const AdminDashboard = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [torneos, setTorneos] = useState([]);
  const [torneoEditando, setTorneoEditando] = useState(null);
  const [mensajeToast, setMensajeToast] = useState('');
  const [mostrarToast, setMostrarToast] = useState(false);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const [showRecompensa, setShowRecompensa] = useState(false);
  const [recompensas, setRecompensas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [showEditarUsuario, setShowEditarUsuario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [mostrarModalRonda, setMostrarModalRonda] = useState(false);
  const [partidasRonda, setPartidasRonda] = useState([]);
  const [ganadoresSeleccionados, setGanadoresSeleccionados] = useState({});
  const [jugadoresPorTorneo, setJugadoresPorTorneo] = useState({});

  // Ordena torneos por estado (activo > inscripción > finalizado)
  const ordenarTorneos = useCallback((lista) => {
    const prioridad = { activo: 0, inscripcion: 1, finalizado: 2 };
    return [...lista].sort((a, b) => {
      const prioridadA = prioridad[a.estado] ?? 3;
      const prioridadB = prioridad[b.estado] ?? 3;
      return prioridadA - prioridadB || b.id - a.id;
    });
  }, []);

  // Carga todos los datos iniciales del dashboard (torneos, recompensas, jugadores por torneo)
  const cargarTodo = useCallback(async () => {
    try {
      const torneosRes = await apiGet('torneos');
      const ordenados = ordenarTorneos(torneosRes);
      setTorneos(ordenados);

      await Promise.all([
        cargarRecompensas(ordenados),
        cargarJugadoresPorTorneo(ordenados),
      ]);
    } catch {
      setMensajeToast('❌ Error al cargar los datos iniciales');
      setMostrarToast(true);
    }
  }, [ordenarTorneos]);

  // Carga recompensas para todos los torneos
  const cargarRecompensas = useCallback(async (listaTorneos) => {
    try {
      const promesas = listaTorneos.map(t =>
        apiGet(`torneos/${t.id}/recompensas`).then(data =>
          data.map(r => ({ ...r, torneo_id: t.id }))
        )
      );
      const resultados = await Promise.all(promesas);
      setRecompensas(resultados.flat());
    } catch (error) {
      console.error('Error al cargar recompensas', error);
    }
  }, []);

  // Carga cantidad de jugadores por torneo
  const cargarJugadoresPorTorneo = useCallback(async (listaTorneos) => {
    try {
      const promesas = listaTorneos.map(t =>
        apiGet(`torneos/${t.id}/jugadores`).then(j => [t.id, j.length])
      );
      const resultados = await Promise.all(promesas);
      setJugadoresPorTorneo(Object.fromEntries(resultados));
    } catch (error) {
      console.error('Error al cargar jugadores por torneo', error);
    }
  }, []);

  // Carga usuarios con rol "jugador"
  const cargarUsuarios = useCallback(async () => {
    try {
      const data = await apiGet('usuarios');
      setUsuarios(data.filter(u => u.rol === 'jugador'));
    } catch (e) {
      console.error('Error cargando usuarios', e);
    }
  }, []);

  // Elimina un torneo con confirmación
  const eliminarTorneo = useCallback(async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este torneo?')) {
      try {
        await apiDelete(`torneos/${id}`);
        await cargarTodo();
        setMensajeToast('Torneo eliminado correctamente.');
        setMostrarToast(true);
      } catch {
        setMensajeToast('❌ Error al eliminar el torneo');
        setMostrarToast(true);
      }
    }
  }, [cargarTodo]);

  // Inicia un torneo, si el usuario lo confirma
  const iniciarTorneo = useCallback(async (id) => {
    if (!confirm('¿Estás seguro de que deseas iniciar este torneo?')) return;
    try {
      const res = await apiPost(`torneos/${id}/iniciar`);
      alert(res.message || 'Torneo iniciado');
      await cargarTodo();
    } catch (error) {
      alert(error.message || '❌ Error al iniciar el torneo');
    }
  }, [cargarTodo]);

  // Finaliza un torneo, si el usuario lo confirma
  const finalizarTorneo = useCallback(async (id) => {
    if (!confirm('¿Estás seguro de que deseas finalizar este torneo?')) return;
    try {
      const res = await apiPost(`torneos/${id}/finalizar`);
      alert(res.message || 'Torneo finalizado');
      await cargarTodo();
    } catch (error) {
      alert(error.message || '❌ Error al finalizar el torneo');
    }
  }, [cargarTodo]);

  // 🔄 Refresca recompensas de un solo torneo sin recargar todo
  const recargarRecompensasDeTorneo = useCallback(async (torneoId) => {
    try {
      const recompensasActualizadas = await apiGet(`torneos/${torneoId}/recompensas`);
      setRecompensas(prev => {
        const sinAntiguas = prev.filter(r => r.torneo_id !== torneoId);
        const nuevas = recompensasActualizadas.map(r => ({ ...r, torneo_id: torneoId }));
        return [...sinAntiguas, ...nuevas];
      });
    } catch (err) {
      console.error('❌ Error al recargar recompensas de torneo', err);
    }
  }, []);

  // Carga partidas actuales de un torneo para pasar de ronda
  const pasarRonda = useCallback(async (id) => {
    try {
      const partidas = await apiGet(`torneos/${id}/partidas-actuales`);
      setPartidasRonda(partidas);
      setTorneoSeleccionado(torneos.find(t => t.id === id));
      setMostrarModalRonda(true);
    } catch (e) {
      setMensajeToast('❌ Error al cargar partidas');
      setMostrarToast(true);
    }
  }, [torneos]);

  // Registra ganadores de una ronda y avanza a la siguiente
  const handleConfirmarGanadores = useCallback(async () => {
    const faltan = partidasRonda.some(p => !ganadoresSeleccionados[p.id]);
    if (faltan) {
      alert('Debes seleccionar un ganador para todas las partidas.');
      return;
    }
    try {
      await apiPost(`torneos/${torneoSeleccionado.id}/guardar-ganadores`, {
        ganadores: ganadoresSeleccionados
      });
      setMensajeToast('Ganadores registrados y ronda actualizada');
      setMostrarToast(true);
      setMostrarModalRonda(false);
      await cargarTodo();
    } catch (e) {
      const msg = e?.response?.data?.message || 'Error al guardar ganadores';
      setMensajeToast(`❌ ${msg}`);
      setMostrarToast(true);
    }
  }, [ganadoresSeleccionados, partidasRonda, torneoSeleccionado, cargarTodo]);

  // Al guardar un torneo nuevo o editado, recarga todo
  const manejarGuardarTorneo = useCallback(async () => {
    await cargarTodo();
    setMensajeToast(torneoEditando ? 'Torneo actualizado correctamente.' : 'Torneo creado correctamente.');
    setMostrarToast(true);
    cerrarFormulario();
  }, [torneoEditando, cargarTodo]);

  // Abre/cierra formulario de torneo
  const abrirFormulario = () => setMostrarFormulario(true);
  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setTorneoEditando(null);
  };

  // Elimina una recompensa específica
  const eliminarRecompensa = useCallback(async (id) => {
    if (confirm('¿Eliminar esta recompensa?')) {
      try {
        await apiDelete(`recompensas/${id}`);
        setRecompensas(prev => prev.filter(r => r.id !== id));
        setMensajeToast('Recompensa eliminada.');
        setMostrarToast(true);
      } catch {
        setMensajeToast('❌ Error al eliminar la recompensa');
        setMostrarToast(true);
      }
    }
  }, []);

  // Guarda los cambios de un usuario editado
  const editarUsuario = useCallback(async () => {
    try {
      await apiPut(`usuarios/${usuarioEditando.id}`, usuarioEditando);
      setMensajeToast('Usuario actualizado');
      setMostrarToast(true);
      setShowEditarUsuario(false);
      cargarUsuarios();
    } catch (err) {
      setMensajeToast('❌ Error al actualizar usuario');
      setMostrarToast(true);
    }
  }, [usuarioEditando, cargarUsuarios]);

  // Elimina un usuario
  const eliminarUsuario = useCallback(async (id) => {
    if (confirm('¿Eliminar este usuario?')) {
      try {
        await apiDelete(`usuarios/${id}`);
        setUsuarios((prev) => prev.filter(u => u.id !== id));
        setMensajeToast('Usuario eliminado');
        setMostrarToast(true);
      } catch {
        setMensajeToast('❌ Error al eliminar');
        setMostrarToast(true);
      }
    }
  }, []);

  // Carga inicial al montar el componente
  useEffect(() => {
    cargarTodo();
    cargarUsuarios();
  }, [cargarTodo, cargarUsuarios]);

  return (
    <TorneoLayout>
      <Container fluid className="py-4" style={{ backgroundColor: '#121212', minHeight: '100vh', overflowX: 'hidden', paddingLeft: '15px', paddingRight: '15px', width: '100%',}}>
        <h2 className="mb-5 text-center" style={{ fontFamily: 'Cinzel, serif', color: '#F8F4E3' }}>
          Gestión de Torneos
        </h2>
        <Row>
          {/* Torneos */}
          <Col md={8} style={{ height: 'calc(100vh - 140px)', overflowY: 'auto', paddingRight: '15px',}}>
            <div className="text-end mb-4">
              <Button
                onClick={abrirFormulario}
                style={{ backgroundColor: '#B22222', border: 'none', color: '#FFD700' }}
              >
                + Añadir Torneo
              </Button>
            </div>
            
            <div style={{ paddingRight: '20px', paddingBottom: '100px' }}>
              <Row className="justify-content-start">
                {torneos.map((torneo) => {
                  const recompensasTorneo = recompensas.filter(r => r.torneo_id === torneo.id);
                  return (
                    <Col md={12} key={torneo.id} className="mb-4">
                      <Card style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3', border: torneo.estado === 'finalizado' ? '2px solid gray' : '1px solid #FFD700', opacity: torneo.estado === 'finalizado' ? 0.7 : 1,}}>
                        <Card.Body>
                          <Card.Title className="text-center">{torneo.nombre}</Card.Title>
                          <Card.Subtitle className="mb-2 text-white text-center">
                            {new Date(torneo.fecha).toLocaleDateString('es-ES')} — {torneo.formato}
                          </Card.Subtitle>
                          <Card.Text className="text-center">{torneo.descripcion}</Card.Text>
                          <ListGroup className="mb-2">
                            {recompensasTorneo.map((r) => (
                              <ListGroup.Item key={r.id} style={{
                                backgroundColor: '#2c2c2c',
                                border: '1px solid #FFD700',
                                color: '#FFD700',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                {r.puesto}º - {r.nombre_carta} ({r.rareza})
                                {torneo.estado === 'inscripcion' && (
                                  <Button size="sm" variant="danger" onClick={() => eliminarRecompensa(r.id)}>Eliminar</Button>
                                )}
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                          <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                            {torneo.estado === 'inscripcion' && (
                              <>
                                <Button
                                  variant="outline-warning"
                                  size="sm"
                                  onClick={() => iniciarTorneo(torneo.id)}
                                  disabled={(jugadoresPorTorneo[torneo.id] || 0) < 2}
                                >
                                  Iniciar Torneo
                                </Button>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  onClick={() => {
                                    setTorneoSeleccionado(torneo);
                                    setShowRecompensa(true);
                                  }}
                                  disabled={recompensasTorneo.length >= 3}
                                >
                                  Añadir Recompensa
                                </Button>
                              </>
                            )}

                            {torneo.estado === 'activo' && (
                              <>
                                <Button
                                  variant="outline-light"
                                  size="sm"
                                  onClick={() => pasarRonda(torneo.id)}
                                >
                                  Pasar Ronda
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => finalizarTorneo(torneo.id)}
                                >
                                  Finalizar Torneo
                                </Button>
                              </>
                            )}

                            {torneo.estado === 'finalizado' && (
                              <span className="text-warning fw-bold">🏁 Torneo Finalizado</span>
                            )}

                            {/* Estos botones siempre disponibles */}
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => {
                                setTorneoEditando(torneo);
                                setMostrarFormulario(true);
                              }}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => eliminarTorneo(torneo.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </Col>

          {/* Usuarios */}
          <Col md={4} style={{ height: 'calc(100vh - 160px)', overflowY: 'auto', paddingLeft: '15px',}}>
            <h5 style={{ color: '#FFD700' }}>Gestión de Jugadores</h5>
            <div style={{ paddingRight: '10px', paddingBottom: '100px' }}>
              <ListGroup>
                {usuarios.map((u) => (
                  <ListGroup.Item key={u.id} style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3' }}>
                    <strong>{u.nombre}</strong><br />
                    <span style={{ fontSize: '0.85rem' }}>{u.email}</span>
                    <div className="mt-2 d-flex gap-2">
                      <Button variant="info" size="sm" onClick={() => {
                        setUsuarioEditando(u);
                        setShowEditarUsuario(true);
                      }}>
                        Editar
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => eliminarUsuario(u.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>
        </Row>


        <FormularioTorneo
          show={mostrarFormulario}
          handleClose={cerrarFormulario}
          onSubmit={manejarGuardarTorneo}
          modo={torneoEditando ? 'editar' : 'crear'}
          torneo={torneoEditando}
        />

        <MdlRecompensa
          show={showRecompensa}
          handleClose={() => setShowRecompensa(false)}
          torneoId={torneoSeleccionado?.id}
          onSave={async () => {
            setShowRecompensa(false);
            if (torneoSeleccionado?.id) {
              await recargarRecompensasDeTorneo(torneoSeleccionado.id);
              setMensajeToast('🎁 Recompensa añadida correctamente');
              setMostrarToast(true);
            }
          }}
        />

        {/* Modal editar usuario */}
        <Modal show={showEditarUsuario} onHide={() => setShowEditarUsuario(false)} centered>
          <Modal.Header closeButton style={{ backgroundColor: '#1c1c1c', color: '#FFD700' }}closeVariant="white">
            <Modal.Title>Editar Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3' }}>
            <Form>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={usuarioEditando?.nombre || ''}
                  onChange={(e) => setUsuarioEditando({ ...usuarioEditando, nombre: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={usuarioEditando?.email || ''}
                  onChange={(e) => setUsuarioEditando({ ...usuarioEditando, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  value={usuarioEditando?.telefono || ''}
                  onChange={(e) => setUsuarioEditando({ ...usuarioEditando, telefono: e.target.value })}
                />
              </Form.Group>
              <Button className="mt-3" variant="success" onClick={editarUsuario}>Guardar Cambios</Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={mostrarModalRonda} onHide={() => setMostrarModalRonda(false)} centered size="lg">
          <Modal.Header closeButton style={{ backgroundColor: '#1c1c1c', color: '#FFD700' }}closeVariant="white">
            <Modal.Title>Gestión de Ronda</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3' }}>
            {partidasRonda.length === 0 ? (
              <p>No hay partidas en esta ronda.</p>
            ) : (
              partidasRonda.map((partida, idx) => (
                <Card key={idx} className="mb-3" style={{ backgroundColor: '#282828', border: '1px solid #FFD700' }}>
                  <Card.Body className="d-flex justify-content-around align-items-center">
                    <Button
                      variant={ganadoresSeleccionados[partida.id] === partida.jugador1.id ? 'success' : 'outline-light'}
                      onClick={() =>
                        setGanadoresSeleccionados(prev => ({ ...prev, [partida.id]: partida.jugador1.id }))
                      }
                    >
                      {partida.jugador1.nombre}
                    </Button>

                    <span>VS</span>

                    {partida.jugador2 ? (
                      <Button
                        variant={ganadoresSeleccionados[partida.id] === partida.jugador2.id ? 'success' : 'outline-light'}
                        onClick={() =>
                          setGanadoresSeleccionados(prev => ({ ...prev, [partida.id]: partida.jugador2.id }))
                        }
                      >
                        {partida.jugador2.nombre}
                      </Button>
                    ) : (
                      <span className="text-warning">Pase automático</span>
                    )}
                  </Card.Body>
                </Card>
              ))
            )}
            <Button className="mt-3" variant="success" onClick={handleConfirmarGanadores}>
              Confirmar Ganadores
            </Button>
          </Modal.Body>
        </Modal>


        <ToastContainer position="bottom-end" className="p-3">
          <Toast bg="success" onClose={() => setMostrarToast(false)} show={mostrarToast} delay={3000} autohide>
            <Toast.Body style={{ color: 'white' }}>{mensajeToast}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </TorneoLayout>
  );
};

export default AdminDashboard;
