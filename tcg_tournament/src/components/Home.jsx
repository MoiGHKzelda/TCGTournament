import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Navbar from './Navbar';


const Home = () => {
  const ejemploCartas = [
    {
      nombre: 'Lightning Bolt',
      imagen: 'https://cards.scryfall.io/normal/front/1/e/1e4e2d2e-7c91-4297-a3f9-f8c730bb20e1.jpg',
    },
    {
      nombre: 'Sorin, Imperious Bloodlord',
      imagen: 'https://cards.scryfall.io/normal/front/7/6/76b23df3-d235-4b94-9de0-89cd503e1d4a.jpg',
    }
  ];

  return (
    <>
      <Navbar />
      <Container className="py-5" style={{ backgroundColor: '#F8F4E3', minHeight: '100vh' }}>
          <h1 className="text-center mb-5" style={{ color: '#B22222', fontFamily: 'Cinzel, serif' }}>
            Bienvenido al Portal de Torneos Magic TCG
          </h1>
          <Row className="g-4 justify-content-center">
            {ejemploCartas.map((carta, idx) => (
              <Col key={idx} xs={12} sm={6} md={4} lg={3}>
                <Card className="h-100 shadow-sm border-0" style={{ backgroundColor: '#fff5e6' }}>
                  <Card.Img variant="top" src={carta.imagen} alt={carta.nombre} />
                  <Card.Body>
                    <Card.Title className="text-center" style={{ fontFamily: 'Cinzel, serif' }}>{carta.nombre}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
      </Container>
    </>

    
  );
};

export default Home;
