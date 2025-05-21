// ✅ FormularioTorneo.jsx
import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { apiPost, apiPut } from '../../services/api';

const FormularioTorneo = ({ show, handleClose, onSubmit, modo = 'crear', torneo = null }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha: '',
    hora: '',
    formato: '',
    max_jugadores: 8,
  });

  useEffect(() => {
    if (torneo) {
      setFormData({
        nombre: torneo.nombre || '',
        descripcion: torneo.descripcion || '',
        fecha: torneo.fecha || '',
        hora: torneo.hora || '',
        formato: torneo.formato || '',
        max_jugadores: torneo.max_jugadores || 8,
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        fecha: '',
        hora: '',
        formato: '',
        max_jugadores: 8,
      });
    }
  }, [torneo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (modo === 'editar' && torneo?.id) {
        response = await apiPut(`torneos/${torneo.id}`, formData);
      } else {
        response = await apiPost('torneos', formData);
      }
      onSubmit(response);
      handleClose();
    } catch (error) {
      alert('Error al guardar el torneo');
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton style={{ backgroundColor: '#1c1c1c', color: '#FFD700' }} closeVariant="white">
        <Modal.Title>{modo === 'editar' ? 'Editar Torneo' : 'Nuevo Torneo'}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#1c1c1c', color: '#F8F4E3' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control name="nombre" type="text" value={formData.nombre} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control name="descripcion" as="textarea" rows={2} value={formData.descripcion} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control name="fecha" type="date" value={formData.fecha} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hora</Form.Label>
            <Form.Control name="hora" type="time" value={formData.hora} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Formato</Form.Label>
            <Form.Control name="formato" type="text" value={formData.formato} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Máximo de Jugadores</Form.Label>
            <Form.Control name="max_jugadores" type="number" min={2} value={formData.max_jugadores} onChange={handleChange} required />
          </Form.Group>
          <div className="text-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancelar
            </Button>
            <Button type="submit" style={{ backgroundColor: '#B22222', border: 'none', color: '#FFD700' }}>
              {modo === 'editar' ? 'Guardar Cambios' : 'Crear Torneo'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormularioTorneo;
