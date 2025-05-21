// ✅ TorneoLayout.jsx
import React from 'react';
import { Container } from 'react-bootstrap';

const TorneoLayout = ({ children }) => {
  return (
    <div
      style={{
        backgroundColor: '#121212',
        paddingTop: '40px',
        paddingBottom: '40px',
        color: '#F8F4E3',
        fontFamily: 'Cinzel, serif',
      }}
    >
      <Container className="text-center">
        {children}
      </Container>
    </div>
  );
};

export default TorneoLayout;