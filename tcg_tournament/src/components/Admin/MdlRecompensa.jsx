// ✅ MdlRecompensa.jsx
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Card, Spinner } from 'react-bootstrap';
import { apiPost } from '../../services/api';

const MdlRecompensa = ({ show, handleClose, torneoId }) => {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [formData, setFormData] = useState({
    nombre_carta: '',
    rareza: '',
    descripcion: '',
    puesto: '1',
  });
  
  const buscarCarta = async () => {
    setCargando(true);
    setMensaje('');
    try {
      const res = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(busqueda)}`);
      const data = await res.json();
      setResultados(data.data || []);
    } catch (error) {
      setMensaje('❌ Error al buscar carta');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const agregarRecompensa = async (carta) => {
    try {
      await apiPost(`torneos/${torneoId}/recompensas`, {
        nombre_carta: carta.name,
        rareza: carta.rarity,
        descripcion: carta.oracle_text || 'Sin descripción',
        puesto: parseInt(formData.puesto), 
      });
      setMensaje('✅ Carta añadida como recompensa');
    } catch (error) {
      setMensaje('❌ Error al guardar recompensa');
      console.error(error);
    }
  };
  

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header
        closeButton
        style={{
            backgroundColor: '#1c1c1c',
            color: '#FFD700',
            borderBottom: '1px solid #FFD700',
        }}
        >
        <style>
            {`
            .btn-close {
                filter: invert(1);
            }
            `}
        </style>
        <Modal.Title>Buscar Carta de Recompensa</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3' }}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre de la carta</Form.Label>
          <Form.Control
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Ej. Lightning Bolt"
          />
        </Form.Group>
        <div className="d-flex justify-content-end mb-3">
          <Button onClick={buscarCarta} disabled={cargando} style={{ backgroundColor: '#B22222', border: 'none' }}>
            {cargando ? <Spinner animation="border" size="sm" /> : 'Buscar'}
          </Button>
        </div>
        {mensaje && <p className="text-warning">{mensaje}</p>}
        <Row>
          {resultados.map((carta) => (
            <Col md={4} key={carta.id} className="mb-3">
              <Card style={{ backgroundColor: '#282828', border: '1px solid #FFD700', color: '#F8F4E3' }}>
                <Card.Img variant="top" src={carta.image_uris?.normal} alt={carta.name} />
                <Card.Body className="text-center">
                  <Card.Title style={{ fontSize: '1rem' }}>{carta.name}</Card.Title>
                  <Card.Text style={{ fontSize: '0.85rem' }}>
                    Rareza: {carta.rarity}
                  </Card.Text>
                  <Button variant="success" size="sm" onClick={() => agregarRecompensa(carta)}>
                    Añadir como Recompensa
                  </Button>
                  <Form.Group className="mb-3">
                    <Form.Label>Puesto</Form.Label>
                        <Form.Select
                            name="puesto"
                            value={formData.puesto}
                            onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                            required
                        >
                            <option value="1">1º Puesto</option>
                            <option value="2">2º Puesto</option>
                            <option value="3">3º Puesto</option>
                        </Form.Select>
                    </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default MdlRecompensa;
