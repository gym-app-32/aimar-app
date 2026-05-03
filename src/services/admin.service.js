import { USE_MOCK, MOCK_DELAY } from '../config'
import { ESPECIALIDADES, PROFESORES, ALUMNOS, DASHBOARD_STATS } from '../mocks/admin.mock'
import api from './api'

const delay = () => new Promise(r => setTimeout(r, MOCK_DELAY))

// ─── Dashboard ────────────────────────────────────────────
export const getDashboardStats = async () => {
  if (USE_MOCK) { await delay(); return { ...DASHBOARD_STATS } }
  return api.get('/admin/dashboard').then(r => r.data)
}

// ─── Especialidades ───────────────────────────────────────
export const getEspecialidades = async () => {
  if (USE_MOCK) { await delay(); return [...ESPECIALIDADES] }
  return api.get('/admin/especialidades').then(r => r.data)
}

export const crearEspecialidad = async (datos) => {
  if (USE_MOCK) { await delay(); return { id: Date.now(), ...datos } }
  return api.post('/admin/especialidades', datos).then(r => r.data)
}

export const updateEspecialidad = async (id, datos) => {
  if (USE_MOCK) { await delay(); return { id, ...datos } }
  return api.put(`/admin/especialidades/${id}`, datos).then(r => r.data)
}

export const deleteEspecialidad = async (id) => {
  if (USE_MOCK) { await delay(); return { id } }
  return api.delete(`/admin/especialidades/${id}`).then(r => r.data)
}

// ─── Profesores ───────────────────────────────────────────
export const getProfesores = async () => {
  if (USE_MOCK) { await delay(); return [...PROFESORES] }
  return api.get('/admin/profesores').then(r => r.data)
}

export const crearProfesor = async (datos) => {
  if (USE_MOCK) { await delay(); return { id: Date.now(), ...datos, activo: true } }
  return api.post('/admin/profesores', datos).then(r => r.data)
}

export const updateProfesor = async (id, datos) => {
  if (USE_MOCK) { await delay(); return { id, ...datos } }
  return api.put(`/admin/profesores/${id}`, datos).then(r => r.data)
}

export const toggleProfesorActivo = async (id, activo) => {
  if (USE_MOCK) { await delay(); return { id, activo } }
  return api.patch(`/admin/profesores/${id}/activo`, { activo }).then(r => r.data)
}

export const deleteProfesor = async (id) => {
  if (USE_MOCK) { await delay(); return { id } }
  return api.delete(`/admin/profesores/${id}`).then(r => r.data)
}

// ─── Alumnos ──────────────────────────────────────────────
export const getAlumnos = async () => {
  if (USE_MOCK) { await delay(); return [...ALUMNOS] }
  return api.get('/admin/alumnos').then(r => r.data)
}

export const crearAlumno = async (datos) => {
  if (USE_MOCK) { await delay(); return { id: Date.now(), ...datos, rutina: 'Sin asignar', activo: true } }
  return api.post('/admin/alumnos', datos).then(r => r.data)
}

export const updateAlumno = async (id, datos) => {
  if (USE_MOCK) { await delay(); return { id, ...datos } }
  return api.put(`/admin/alumnos/${id}`, datos).then(r => r.data)
}

export const toggleAlumnoActivo = async (id, activo) => {
  if (USE_MOCK) { await delay(); return { id, activo } }
  return api.patch(`/admin/alumnos/${id}/activo`, { activo }).then(r => r.data)
}

export const deleteAlumno = async (id) => {
  if (USE_MOCK) { await delay(); return { id } }
  return api.delete(`/admin/alumnos/${id}`).then(r => r.data)
}