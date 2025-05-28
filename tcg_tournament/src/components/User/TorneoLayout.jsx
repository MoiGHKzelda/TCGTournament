import React from 'react';
import { Container } from 'react-bootstrap';

const TorneoLayout = ({ children }) => {
  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: '#121212',
        color: '#F8F4E3',
        fontFamily: 'Cinzel, serif',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flex: 1, padding: '40px 15px' }}>
        <Container fluid style={{ height: '100%' }}>
          {children}
        </Container>
      </div>
    </div>
  );
};

export default TorneoLayout;

