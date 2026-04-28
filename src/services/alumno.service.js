import { USE_MOCK, MOCK_DELAY } from '../config'
import {
  ALUMNO,
  RUTINA_ACTIVA,
  CLASES,
  HISTORIAL,
  HISTORIAL_POR_FECHA,
  ENCUESTAS_PENDIENTES,
} from '../mocks/alumno.mock'
import api from './api'

// Simula latencia de red
const delay = () => new Promise(r => setTimeout(r, MOCK_DELAY))

// ─── Perfil ───────────────────────────────────────────────
export const getPerfil = async () => {
  if (USE_MOCK) { await delay(); return { ...ALUMNO } }
  return api.get('/alumno/perfil').then(r => r.data)
}

export const updatePerfil = async (datos) => {
  if (USE_MOCK) { await delay(); return { ...ALUMNO, ...datos } }
  return api.put('/alumno/perfil', datos).then(r => r.data)
}

// ─── Rutina ───────────────────────────────────────────────
export const getRutinaActiva = async () => {
  if (USE_MOCK) { await delay(); return { ...RUTINA_ACTIVA } }
  return api.get('/alumno/rutina').then(r => r.data)
}

// ─── Clases ───────────────────────────────────────────────
export const getClases = async () => {
  if (USE_MOCK) { await delay(); return [...CLASES] }
  return api.get('/alumno/clases').then(r => r.data)
}

// ─── Entrenamientos ───────────────────────────────────────
export const registrarEntrenamiento = async (datos) => {
  if (USE_MOCK) {
    await delay()
    return { id: Date.now(), ...datos, fechaRegistro: new Date().toISOString() }
  }
  return api.post('/alumno/entrenamientos', datos).then(r => r.data)
}

export const registrarAsistencia = async (claseId, fecha) => {
  if (USE_MOCK) {
    await delay()
    return { id: Date.now(), claseId, fecha, fechaRegistro: new Date().toISOString() }
  }
  return api.post('/alumno/asistencias', { claseId, fecha }).then(r => r.data)
}

// ─── Historial ────────────────────────────────────────────
export const getHistorial = async () => {
  if (USE_MOCK) { await delay(); return [...HISTORIAL] }
  return api.get('/alumno/historial').then(r => r.data)
}

export const getHistorialPorFecha = async () => {
  if (USE_MOCK) { await delay(); return { ...HISTORIAL_POR_FECHA } }
  return api.get('/alumno/historial/calendario').then(r => r.data)
}

// ─── Encuestas ────────────────────────────────────────────
export const getEncuestasPendientes = async () => {
  if (USE_MOCK) { await delay(); return [...ENCUESTAS_PENDIENTES] }
  return api.get('/alumno/encuestas/pendientes').then(r => r.data)
}

export const enviarEncuesta = async (datos) => {
  if (USE_MOCK) {
    await delay()
    return { id: Date.now(), ...datos, fecha: new Date().toISOString() }
  }
  return api.post('/alumno/encuestas', datos).then(r => r.data)
}