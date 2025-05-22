// ✅ AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Card, Container, Toast, ToastContainer, ListGroup } from 'react-bootstrap';
import TorneoLayout from '../User/TorneoLayout';
import FormularioTorneo from './FormularioTorneo';
import { apiGet, apiDelete } from '../../services/api';
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
      } catch (error) {
        setMensajeToast('❌ Error al eliminar el torneo');
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

  const eliminarRecompensa = async (id) => {
    if (confirm('¿Eliminar esta recompensa?')) {
      try {
        await apiDelete(`recompensas/${id}`);
        setRecompensas((prev) => prev.filter((r) => r.id !== id));
        setMensajeToast('Recompensa eliminada.');
        setMostrarToast(true);
      } catch (error) {
        setMensajeToast('❌ Error al eliminar la recompensa');
        setMostrarToast(true);
      }
    }
  };
  

  useEffect(() => {
    apiGet('torneos')
      .then((data) => {
        setTorneos(Array.isArray(data) ? data : data.data || []);
      })
      .catch(() => setTorneos([]));
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
        <div className="text-end mb-4">
          <Button onClick={abrirFormulario} style={{ backgroundColor: '#B22222', border: 'none', color: '#FFD700' }}>
            + Añadir Torneo
          </Button>
        </div>
        <Row className="justify-content-center">
          {torneos.length > 0 ? (
            torneos.map((torneo) => {
              const recompensasTorneo = recompensas.filter(r => r.torneo_id === torneo.id);
              return (
                <Col md={5} key={torneo.id} className="mb-4">
                  <Card style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3', border: '1px solid #FFD700' }}>
                    <Card.Body>
                      <Card.Title className="text-center">{torneo.nombre}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted text-center">
                        {torneo.fecha} — {torneo.formato}
                      </Card.Subtitle>
                      <Card.Text className="text-center">{torneo.descripcion}</Card.Text>

                      <ListGroup className="mb-2">
                        {recompensasTorneo.map((r) => (
                          <ListGroup.Item
                            key={r.id}
                            style={{
                              backgroundColor: '#2c2c2c',
                              border: '1px solid #FFD700',
                              color: '#FFD700',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            {r.puesto}º - {r.nombre_carta} ({r.rareza})
                            {torneo.estado === 'inscripcion' && (
                              <Button size="sm" variant="danger" onClick={() => eliminarRecompensa(r.id)}>X</Button>
                            )}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>

                      <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                        <Button variant="outline-warning" size="sm">Iniciar Torneo</Button>
                        <Button variant="outline-light" size="sm">Pasar Ronda</Button>
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
                        <Button variant="outline-danger" size="sm" onClick={() => eliminarTorneo(torneo.id)}>Eliminar</Button>
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
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          ) : (
            <Col>
              <p style={{ color: '#888' }}>No hay torneos cargados aún.</p>
            </Col>
          )}
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
