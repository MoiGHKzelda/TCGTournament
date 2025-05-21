// ✅ Torneos.jsx
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { apiGet } from '../../services/api';
import TorneoLayout from './TorneoLayout';

const Torneos = () => {
  const [torneos, setTorneos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    apiGet('torneos')
      .then(data => setTorneos(data))
      .catch(() => setMensaje('Error al cargar los torneos'));
  }, []);

  return (
    <TorneoLayout>
      <h2 className="mb-4">Torneos Disponibles</h2>
      {mensaje && <p className="text-danger">{mensaje}</p>}
      <Row className="justify-content-center">
        {torneos.map((torneo) => (
          <Col key={torneo.id} md={6} lg={4} className="mb-4">
            <Card style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3', border: '1px solid #FFD700' }}>
              <Card.Body>
                <Card.Title>{torneo.nombre}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{torneo.formato}</Card.Subtitle>
                <Card.Text>{torneo.descripcion}</Card.Text>
                <Card.Text>
                  Fecha: {torneo.fecha} — Hora: {torneo.hora}
                </Card.Text>
                <div className="d-flex justify-content-between mt-3">
                  <Button
                    variant="outline-light"
                    style={{ borderColor: '#FFD700', color: '#FFD700' }}
                    size="sm"
                  >
                    Foro
                  </Button>
                  <Button
                    variant="outline-light"
                    style={{ borderColor: '#FFD700', color: '#FFD700' }}
                    size="sm"
                  >
                    Emparejamientos
                  </Button>
                  <Button
                    style={{ backgroundColor: '#B22222', border: 'none', color: '#FFD700' }}
                    size="sm"
                  >
                    Apuntarse
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </TorneoLayout>
  );
};

export default Torneos;
