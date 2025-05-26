import React from 'react';
import { Container } from 'react-bootstrap';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div
      style={{
        backgroundColor: '#121212',
        minHeight: '100vh',
        color: '#F8F4E3',
        fontFamily: 'Cinzel, serif',
        overflowX: 'hidden',
        width: '100%',
      }}
    >
      <Navbar />
      <Container
        className="py-4"
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

export default Layou
