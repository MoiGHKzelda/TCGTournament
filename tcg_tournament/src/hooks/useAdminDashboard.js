import { useEffect, useState } from 'react';
import { apiGet, apiDelete } from '../services/api';

export const useAdminDashboard = () => {
  const [torneos, setTorneos] = useState([]);
  const [recompensas, setRecompensas] = useState([]);

  const cargarTorneos = async () => {
    try {
      const data = await apiGet('torneos');
      setTorneos(Array.isArray(data) ? data : data.data || []);
    } catch {
      setTorneos([]);
    }
  };

  const cargarRecompensas = async (torneosLista) => {
    try {
      const recompensasAll = [];
      for (const torneo of torneosLista) {
        const data = await apiGet(`torneos/${torneo.id}/recompensas`);
        recompensasAll.push(...data.map(r => ({ ...r, torneo_id: torneo.id })));
      }
      setRecompensas(recompensasAll);
    } catch (error) {
      console.error('Error al cargar recompensas', error);
    }
  };

  const eliminarTorneo = async (id) => {
    await apiDelete(`torneos/${id}`);
    setTorneos(prev => prev.filter(t => t.id !== id));
  };

  const eliminarRecompensa = async (id) => {
    await apiDelete(`recompensas/${id}`);
    setRecompensas(prev => prev.filter(r => r.id !== id));
  };

  return {
    torneos, recompensas,
    setTorneos, setRecompensas,
    cargarTorneos, cargarRecompensas,
    eliminarTorneo, eliminarRecompensa
  };
};