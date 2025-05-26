import React from 'react';
import { Container } from 'react-bootstrap';

const TorneoLayout = ({ children }) => {
  return (
    <div
      style={{
        backgroundColor: '#121212',
        color: '#F8F4E3',
        fontFamily: 'Cinzel, serif',
        paddingTop: '40px',
        paddingBottom: '40px',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden'
      }}
    >
      <Container
        className="text-center"
        style={{
          overflowX: 'hidden',
          paddingLeft: '15px',
          paddingRight: '15px'
        }}
      >
        {children}
      </Container>
    </div>
  );
};

export default TorneoLayout;
