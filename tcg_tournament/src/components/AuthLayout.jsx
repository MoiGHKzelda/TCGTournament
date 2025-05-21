import React from 'react';
import { Container } from 'react-bootstrap';

const AuthLayout = ({ children }) => {
  return (
    <div style={{ backgroundColor: '#121212', color: '#F8F4E3', fontFamily: 'Cinzel, serif' }}>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        {children}
      </Container>
    </div>
  );
};

export default AuthLayout;
