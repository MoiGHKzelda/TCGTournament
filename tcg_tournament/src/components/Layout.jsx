import React from 'react';
import { Container } from 'react-bootstrap';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#F8F4E3', fontFamily: 'Cinzel, serif' }}>
      <Navbar />
      <Container className="py-4">
        {children}
      </Container>
    </div>
  );
};

export default Layout;
