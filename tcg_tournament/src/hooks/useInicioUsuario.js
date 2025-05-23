import { useEffect, useState } from 'react';
import { apiGet, apiPut } from '../services/api';

export const useInicioUsuario = (user, login, token) => {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [torneos, setTorneos] = useState([]);
  const [recompensas, setRecompensas] = useState([]);

  useEffect(() => {
    apiGet('user').then(setUsuario).catch(() => setUsuario(null));
    apiGet('torneos').then(setTorneos).catch(() => setTorneos([]));
  }, []);

  useEffect(() => {
    if (usuario?.id) {
      apiGet('perfiles')
        .then(perfiles => {
          const p = perfiles.find(p => p.usuario_id === usuario.id);
          setPerfil(p);
        })
        .catch(() => setPerfil(null));
    }
  }, [usuario?.id]);

  const cargarRecompensas = async () => {
    try {
      const all = [];
      for (const torneo of torneos) {
        const data = await apiGet(`torneos/${torneo.id}/recompensas`);
        all.push(...data.map(r => ({ ...r, torneo_id: torneo.id })));
      }
      setRecompensas(all);
    } catch (error) {
      console.error('❌ Error al cargar recompensas:', error);
    }
  };

  useEffect(() => {
    if (torneos.length > 0) {
      cargarRecompensas();
    }
  }, [torneos]);

  const cambiarAvatar = async (nuevoAvatar) => {
    try {
      await apiPut(`usuarios/${user.id}`, { avatar: nuevoAvatar });
      const usuarioActualizado = await apiGet('user');
      login(usuarioActualizado, token);
      setUsuario(usuarioActualizado);
    } catch (error) {
      alert('Error al cambiar el avatar');
    }
  };

  return {
    usuario, perfil, torneos, recompensas,
    setUsuario, cambiarAvatar, cargarRecompensas
  };
};