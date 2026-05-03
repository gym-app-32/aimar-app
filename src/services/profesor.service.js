import { USE_MOCK, MOCK_DELAY } from '../config'
import { MIS_ALUMNOS, UTILITARIOS, EJERCICIOS, RUTINAS } from '../mocks/profesor.mock'
import api from './api'

const delay = () => new Promise(r => setTimeout(r, MOCK_DELAY))

// ─── Alumnos ──────────────────────────────────────────────
export const getMisAlumnos = async () => {
  if (USE_MOCK) { await delay(); return [...MIS_ALUMNOS] }
  return api.get('/profesor/alumnos').then(r => r.data)
}

export const crearAlumno = async (datos) => {
  if (USE_MOCK) { await delay(); return { id: Date.now(), ...datos, rutina: 'Sin asignar', activo: true } }
  return api.post('/profesor/alumnos', datos).then(r => r.data)
}

export const updateAlumno = async (id, datos) => {
  if (USE_MOCK) { await delay(); return { id, ...datos } }
  return api.put(`/profesor/alumnos/${id}`, datos).then(r => r.data)
}

export const toggleAlumnoActivo = async (id, activo) => {
  if (USE_MOCK) { await delay(); return { id, activo } }
  return api.patch(`/profesor/alumnos/${id}/activo`, { activo }).then(r => r.data)
}

// ─── Utilitarios ──────────────────────────────────────────
export const getUtilitarios = async () => {
  if (USE_MOCK) { await delay(); return [...UTILITARIOS] }
  return api.get('/profesor/utilitarios').then(r => r.data)
}

export const crearUtilitario = async (datos) => {
  if (USE_MOCK) { await delay(); return { id: Date.now(), ...datos } }
  return api.post('/profesor/utilitarios', datos).then(r => r.data)
}

export const updateUtilitario = async (id, datos) => {
  if (USE_MOCK) { await delay(); return { id, ...datos } }
  return api.put(`/profesor/utilitarios/${id}`, datos).then(r => r.data)
}

export const deleteUtilitario = async (id) => {
  if (USE_MOCK) { await delay(); return { id } }
  return api.delete(`/profesor/utilitarios/${id}`).then(r => r.data)
}

// ─── Ejercicios ───────────────────────────────────────────
export const getEjercicios = async () => {
  if (USE_MOCK) { await delay(); return [...EJERCICIOS] }
  return api.get('/profesor/ejercicios').then(r => r.data)
}

export const crearEjercicio = async (datos) => {
  if (USE_MOCK) { await delay(); return { id: Date.now(), ...datos } }
  return api.post('/profesor/ejercicios', datos).then(r => r.data)
}

export const updateEjercicio = async (id, datos) => {
  if (USE_MOCK) { await delay(); return { id, ...datos } }
  return api.put(`/profesor/ejercicios/${id}`, datos).then(r => r.data)
}

export const deleteEjercicio = async (id) => {
  if (USE_MOCK) { await delay(); return { id } }
  return api.delete(`/profesor/ejercicios/${id}`).then(r => r.data)
}

// ─── Rutinas ──────────────────────────────────────────────
export const getRutinas = async () => {
  if (USE_MOCK) { await delay(); return [...RUTINAS] }
  return api.get('/profesor/rutinas').then(r => r.data)
}

export const crearRutina = async (datos) => {
  if (USE_MOCK) { await delay(); return { id: Date.now(), ...datos } }
  return api.post('/profesor/rutinas', datos).then(r => r.data)
}

export const updateRutina = async (id, datos) => {
  if (USE_MOCK) { await delay(); return { id, ...datos } }
  return api.put(`/profesor/rutinas/${id}`, datos).then(r => r.data)
}

export const deleteRutina = async (id) => {
  if (USE_MOCK) { await delay(); return { id } }
  return api.delete(`/profesor/rutinas/${id}`).then(r => r.data)
}