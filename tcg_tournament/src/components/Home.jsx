import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Layout from './Layout';

const torneos = [
  {
    id: 1,
    nombre: 'Torneo de Commander',
    formato: 'Commander',
    fecha: '01 de mayo de 2025',
    estado: 'Activo',
    ranking: [
      { id: 1, nombre: 'Ana', puntos: 1500 },
      { id: 2, nombre: 'Carlos', puntos: 1600 },
    ],
    jueces: ['Elena']
  },
  {
    id: 2,
    nombre: 'Torneo de Modern',
    formato: 'Modern',
    fecha: '15 de mayo de 2025',
    estado: 'Activo',
    ranking: [
      { id: 1, nombre: 'Luis', puntos: 1650 },
      { id: 2, nombre: 'Sofía', puntos: 1570 },
    ],
    jueces: ['Javier']
  }
];

const Home = () => {
  return (
    <Layout>
      <h1 className="mb-4" style={{ color: '#F8F4E3' }}>Torneos Disponibles</h1>
      <Row className="g-4">
        {torneos.map(torneo => (
          <Col key={torneo.id} xs={12} md={6}>
            <Card className="h-100 border-danger text-light" style={{ backgroundColor: '#1c1c1c' }}>
              <Card.Body>
                <Card.Title style={{ fontFamily: 'Cinzel, serif' }}>{torneo.nombre}</Card.Title>
                <p><strong>Formato:</strong> {torneo.formato}</p>
                <p><strong>Fecha:</strong> {torneo.fecha} <span className="ms-3 text-success">{torneo.estado}</span></p>
                <Button variant="danger" className="mb-3">Participar</Button>
                <h6 className="mt-3">Ranking</h6>
                <table className="table table-dark table-sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Puntos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {torneo.ranking.map(j => (
                      <tr key={j.id}>
                        <td>{j.id}</td>
                        <td>{j.nombre}</td>
                        <td>{j.puntos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <h6>Jueces</h6>
                <ul>
                  {torneo.jueces.map((juez, idx) => (
                    <li key={idx}>{juez}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Layout>
  );
};

export default Home;
