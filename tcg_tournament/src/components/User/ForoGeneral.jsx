import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Modal, Form } from 'react-bootstrap';
import { apiGet, apiPost } from '../../services/api';
import TorneoLayout from '../User/TorneoLayout';
import { useAuth } from '../../context/AuthContext';

const ForoGeneral = () => {
  const [comentarios, setComentarios] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [comentarioActual, setComentarioActual] = useState(null);
  const [expandido, setExpandido] = useState({});
  const { user } = useAuth();

  const [nuevoComentario, setNuevoComentario] = useState({
    titulo: '',
    contenido: '',
    torneo_id: '',
    padre_id: null
  });

  useEffect(() => {
    apiGet('anuncios')
      .then(setComentarios)
      .catch((err) => {
        console.error('❌ Error cargando anuncios:', err);
        setComentarios([]);
      });

    apiGet('torneos')
      .then(setTorneos)
      .catch((err) => {
        console.error('❌ Error cargando torneos:', err);
        setTorneos([]);
      });
  }, []);

  const handleChange = (e) => {
    setNuevoComentario({ ...nuevoComentario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiPost('anuncios', nuevoComentario);
      if (nuevoComentario.padre_id) {
        setComentarios(prev => prev.map(c =>
          c.id === nuevoComentario.padre_id
            ? { ...c, respuestas: [...(c.respuestas || []), res] }
            : c
        ));
      } else {
        setComentarios(prev => [res, ...prev]);
      }
      setShowModal(false);
      setNuevoComentario({ titulo: '', contenido: '', torneo_id: '', padre_id: null });
    } catch (error) {
      alert('Error al publicar');
    }
  };

  const toggleExpandido = (id) => {
    setExpandido(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const abrirModalComentario = () => {
    setNuevoComentario({ titulo: '', contenido: '', torneo_id: '', padre_id: null });
    setComentarioActual(null);
    setShowModal(true);
  };

  const abrirModalRespuesta = (comentario) => {
    setNuevoComentario({ titulo: '', contenido: '', torneo_id: '', padre_id: comentario.id });
    setComentarioActual(comentario);
    setShowModal(true);
  };

  return (
    <TorneoLayout>
      <Container fluid className="py-4" style={{ backgroundColor: '#121212', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
        <h2 className="text-center mb-4" style={{ color: '#FFD700', fontFamily: 'Cinzel, serif' }}>
          Foro General
        </h2>
        <div style={{flex: 1, overflowY: 'auto', paddingRight: '10px', paddingBottom: '100px' }}>
          <div className="text-end mb-3">
            <Button onClick={abrirModalComentario} style={{ backgroundColor: '#B22222', border: 'none', color: '#FFD700' }}>
              + Añadir Comentario
            </Button>
          </div>

          {comentarios.map((comentario) => (
            <Card key={comentario.id} className="mb-4" style={{ backgroundColor: '#1c1c1c', border: '1px solid #FFD700' }}>
              <Card.Body>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={`/img/${comentario.usuario?.avatar || 'avatar_1.png'}`}
                    alt="Avatar"
                    style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #B22222'
                    }}
                  />
                  <div>
                    <strong style={{ color: '#FFD700' }}>{comentario.usuario?.nombre}</strong>
                    <div style={{ color: '#AAA', fontSize: '0.8em' }}>
                      Torneo: {comentario.torneo?.nombre || 'General'}
                    </div>
                  </div>
                </div>
                <Card.Title className="mt-3" style={{ color: '#FFD700' }}>{comentario.titulo}</Card.Title>
                <Card.Text style={{
                  border: '1px solid #B22222',
                  padding: '0.5rem',
                  backgroundColor: '#1c1c1c',
                  color: '#F8F4E3'
                }}>
                  {comentario.contenido}
                </Card.Text>
                <div className="d-flex gap-2">
                  <Button variant="warning" size="sm" onClick={() => toggleExpandido(comentario.id)}>
                    {comentario.respuestas?.length || 0} Respuestas
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => abrirModalRespuesta(comentario)}>
                    Responder
                  </Button>
                </div>

                {expandido[comentario.id] && comentario.respuestas?.length > 0 && (
                  <div className="mt-3 ms-4">
                    {comentario.respuestas.map(res => (
                      <Card key={res.id} className="mb-2" style={{ backgroundColor: '#1c1c1c', border: '1px solid #B22222' }}>
                        <Card.Body className="d-flex align-items-start gap-3">
                          <img
                            src={`/img/${res.usuario?.avatar || 'avatar_1.png'}`}
                            alt="Avatar"
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid #B22222'
                            }}
                          />
                          <div>
                            <strong style={{ color: '#FFD700' }}>{res.usuario?.nombre}</strong>
                            <Card.Text style={{ color: '#F8F4E3', marginTop: '0.3rem' }}>{res.contenido}</Card.Text>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton closeVariant="white" style={{ backgroundColor: '#1c1c1c', color: '#FFD700' }}>
            <Modal.Title>{comentarioActual ? 'Responder Comentario' : 'Nuevo Comentario'}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3' }}>
            <Form onSubmit={handleSubmit}>
              {!comentarioActual && (
                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    name="titulo"
                    type="text"
                    value={nuevoComentario.titulo}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Contenido</Form.Label>
                <Form.Control
                  as="textarea"
                  name="contenido"
                  value={nuevoComentario.contenido}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              {!comentarioActual && (
                <Form.Group className="mb-3">
                  <Form.Label>Torneo Asociado (opcional)</Form.Label>
                  <Form.Select
                    name="torneo_id"
                    value={nuevoComentario.torneo_id}
                    onChange={handleChange}
                  >
                    <option value="">General</option>
                    {torneos.map((t) => (
                      <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
              <div className="text-end">
                <Button type="submit" style={{ backgroundColor: '#B22222', border: 'none', color: '#FFD700' }}>
                  Publicar
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </TorneoLayout>
  );
};

export default ForoGeneral;
