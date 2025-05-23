// ✅ AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  Button, Col, Row, Card, Container,
  Toast, ToastContainer, ListGroup, Modal, Form
} from 'react-bootstrap';
import TorneoLayout from '../User/TorneoLayout';
import FormularioTorneo from './FormularioTorneo';
import { apiGet, apiDelete, apiPut } from '../../services/api';
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

  const abrirFormulario = () => setMostrarFormulario(true);
  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setTorneoEditando(null);
  };

  const manejarGuardarTorneo = (torneoActualizado) => {
    if (torneoEditando) {
      setTorneos((prev) =>
        prev.map((t) => (t.id === torneoActualizado.id ? torneoActualizado : t))
      );
      setMensajeToast('Torneo actualizado correctamente.');
    } else {
      setTorneos((prev) => [...prev, torneoActualizado]);
      setMensajeToast('Torneo creado correctamente.');
    }
    setMostrarToast(true);
    cerrarFormulario();
  };

  const eliminarTorneo = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este torneo?')) {
      try {
        await apiDelete(`torneos/${id}`);
        setTorneos((prev) => prev.filter((torneo) => torneo.id !== id));
        setMensajeToast('Torneo eliminado correctamente.');
        setMostrarToast(true);
      } catch {
        setMensajeToast('❌ Error al eliminar el torneo');
        setMostrarToast(true);
      }
    }
  };

  const eliminarRecompensa = async (id) => {
    if (confirm('¿Eliminar esta recompensa?')) {
      try {
        await apiDelete(`recompensas/${id}`);
        setRecompensas((prev) => prev.filter((r) => r.id !== id));
        setMensajeToast('Recompensa eliminada.');
        setMostrarToast(true);
      } catch {
        setMensajeToast('❌ Error al eliminar la recompensa');
        setMostrarToast(true);
      }
    }
  };

  const cargarRecompensas = async () => {
    try {
      const recompensasAll = [];
      for (const torneo of torneos) {
        const data = await apiGet(`torneos/${torneo.id}/recompensas`);
        recompensasAll.push(...data.map(r => ({ ...r, torneo_id: torneo.id })));
      }
      setRecompensas(recompensasAll);
    } catch (error) {
      console.error('Error al cargar recompensas', error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const data = await apiGet('usuarios');
      setUsuarios(data.filter(u => u.rol === 'jugador'));
    } catch (e) {
      console.error('Error cargando usuarios', e);
    }
  };

  const editarUsuario = async () => {
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
  };

  const eliminarUsuario = async (id) => {
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
  };

  useEffect(() => {
    apiGet('torneos')
      .then(setTorneos)
      .catch(() => setTorneos([]));
    cargarUsuarios();
  }, []);

  useEffect(() => {
    if (torneos.length > 0) cargarRecompensas();
  }, [torneos]);

  return (
    <TorneoLayout>
      <Container fluid className="py-4" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
        <h2 className="mb-5 text-center" style={{ fontFamily: 'Cinzel, serif', color: '#F8F4E3' }}>
          Gestión de Torneos
        </h2>
        <Row>
          {/* Torneos */}
          <Col md={8}>
            <div className="text-end mb-4">
              <Button onClick={abrirFormulario} style={{ backgroundColor: '#B22222', border: 'none', color: '#FFD700' }}>
                + Añadir Torneo
              </Button>
            </div>
            <Row className="justify-content-start">
              {torneos.map((torneo) => {
                const recompensasTorneo = recompensas.filter(r => r.torneo_id === torneo.id);
                return (
                  <Col md={12} key={torneo.id} className="mb-4">
                    <Card style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3', border: '1px solid #FFD700' }}>
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
                              <Button size="sm" variant="danger" onClick={() => eliminarRecompensa(r.id)}>Eliminar</Button>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                        <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                          <Button variant="outline-warning" size="sm">Iniciar Torneo</Button>
                          <Button variant="outline-light" size="sm">Pasar Ronda</Button>
                          <Button variant="outline-info" size="sm" onClick={() => {
                            setTorneoEditando(torneo);
                            setMostrarFormulario(true);
                          }}>
                            Editar
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => eliminarTorneo(torneo.id)}>
                            Eliminar
                          </Button>
                          <Button variant="outline-success" size="sm" onClick={() => {
                            setTorneoSeleccionado(torneo);
                            setShowRecompensa(true);
                          }} disabled={recompensasTorneo.length >= 3}>
                            Añadir Recompensa
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Col>

          {/* Usuarios */}
          <Col md={4}>
            <h5 style={{ color: '#FFD700' }}>Gestión de Jugadores</h5>
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
          onSave={() => {
            setShowRecompensa(false);
            cargarRecompensas();
          }}
        />

        {/* Modal editar usuario */}
        <Modal show={showEditarUsuario} onHide={() => setShowEditarUsuario(false)} centered>
          <Modal.Header closeButton style={{ backgroundColor: '#1c1c1c', color: '#FFD700' }}>
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
