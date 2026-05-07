import { useState, useEffect } from 'react'

import Modal from '../../components/UI/Modal/Modal'
import styles from './AlumnoDashboard.module.scss'
import Loader from '../../components/Loader/Loader'
import HeaderRutina from '../../components/Entrenamiento/Rutina/HeaderRutina'
import SelectorFecha from '../../components/Entrenamiento/Rutina/SelectorFecha'
import EntrenamientoClase from '../../components/Entrenamiento/Clase/EntrenamientoClase'
import EntrenamientoRutina from '../../components/Entrenamiento/Rutina/EntrenamientoRutina'

// ─── Mock data ────────────────────────────────────────────
const MOCK_RUTINA = {
  nombre: 'Fuerza + Hipertrofia',
  inicio: '2026-04-01',
  semanas: 6,
  semanaActual: 3,
  dias: [
    {
      id: 1, nombre: 'Piernas', gruposMusculares: 'Cuádriceps, Glúteos, Isquiotibiales',
      precalentamiento: {
        repeticionesSerie: 1, descanso: 0,
        ejercicios: [
          { nombre: 'Bicicleta estática', reps: ['10 min'], descripcion: 'Calentamiento cardiovascular suave.', video: '', utilitarios: [{ nombre: 'Bicicleta', foto: null }] },
          { nombre: 'Salto a la soga', reps: ['5 min'], descripcion: 'Activación cardiovascular.', video: '', utilitarios: [{ nombre: 'Soga', foto: null }] },
        ]
      },
      series: [
        {
          id: 1, repeticionesSerie: 4, descanso: 10, ejercicios: [
            { nombre: 'Sentadilla con barra', reps: [8, 8, 7, 6], descripcion: 'Ejercicio compuesto para piernas y glúteos.', video: 'https://youtube.com', utilitarios: [{ nombre: 'Barra olímpica', foto: null }, { nombre: 'Rack', foto: null }] },
            { nombre: 'Prensa de piernas', reps: [12, 12, 10, 10], descripcion: 'Máquina para cuádriceps.', video: '', utilitarios: [{ nombre: 'Prensa', foto: null }] },
          ]
        },
        {
          id: 2, repeticionesSerie: 3, descanso: 10, ejercicios: [
            { nombre: 'Curl femoral', reps: [12, 12, 12], descripcion: 'Isquiotibiales en máquina.', video: '', utilitarios: [{ nombre: 'Máquina curl', foto: null }] },
            { nombre: 'Extensión de pierna', reps: [15, 15, 12], descripcion: 'Cuádriceps en máquina.', video: '', utilitarios: [{ nombre: 'Máquina extensión', foto: null }] },
          ]
        },
      ],
      postentrenamiento: {
        repeticionesSerie: 1, descanso: 0,
        ejercicios: [
          { nombre: 'Estiramiento cuádriceps', reps: ['2 min'], descripcion: 'Estiramiento estático.', video: '', utilitarios: [] },
          { nombre: 'Estiramiento isquios', reps: ['2 min'], descripcion: 'Estiramiento isquios.', video: '', utilitarios: [] },
        ]
      },
    },
    {
      id: 2, nombre: 'Empuje', gruposMusculares: 'Pecho, Hombros, Tríceps',
      precalentamiento: {
        repeticionesSerie: 1, descanso: 0,
        ejercicios: [{ nombre: 'Soga de saltar', reps: ['5 min'], descripcion: 'Activación cardiovascular.', video: '', utilitarios: [{ nombre: 'Soga', foto: null }] }]
      },
      series: [
        {
          id: 1, repeticionesSerie: 4, descanso: 90, ejercicios: [
            { nombre: 'Press de banca', reps: [8, 8, 7, 6], descripcion: 'Pecho y tríceps.', video: 'https://youtube.com', utilitarios: [{ nombre: 'Barra olímpica', foto: null }, { nombre: 'Banco plano', foto: null }] },
            { nombre: 'Press militar', reps: [10, 10, 8, 8], descripcion: 'Hombros.', video: '', utilitarios: [{ nombre: 'Barra olímpica', foto: null }] },
          ]
        },
        {
          id: 2, repeticionesSerie: 3, descanso: 60, ejercicios: [
            { nombre: 'Extensión tríceps', reps: [12, 12, 12], descripcion: 'Aislamiento tríceps.', video: '', utilitarios: [{ nombre: 'Polea alta', foto: null }] },
          ]
        },
      ],
      postentrenamiento: {
        repeticionesSerie: 1, descanso: 0,
        ejercicios: [{ nombre: 'Estiramiento pecho', reps: ['2 min'], descripcion: 'Estiramiento pecho.', video: '', utilitarios: [] }]
      },
    },
    {
      id: 3, nombre: 'Tirón', gruposMusculares: 'Espalda, Bíceps, Trapecios',
      precalentamiento: {
        repeticionesSerie: 1, descanso: 0,
        ejercicios: [{ nombre: 'Bicicleta estática', reps: ['8 min'], descripcion: 'Calentamiento.', video: '', utilitarios: [{ nombre: 'Bicicleta', foto: null }] }]
      },
      series: [
        {
          id: 1, repeticionesSerie: 4, descanso: 90, ejercicios: [
            { nombre: 'Remo con barra', reps: [8, 8, 8, 6], descripcion: 'Espalda y bíceps.', video: 'https://youtube.com', utilitarios: [{ nombre: 'Barra olímpica', foto: null }] },
            { nombre: 'Jalón al pecho', reps: [10, 10, 10, 8], descripcion: 'Dorsal con polea.', video: '', utilitarios: [{ nombre: 'Polea alta', foto: null }] },
          ]
        },
        {
          id: 2, repeticionesSerie: 3, descanso: 60, ejercicios: [
            { nombre: 'Curl de bíceps', reps: [12, 12, 10], descripcion: 'Aislamiento bíceps.', video: '', utilitarios: [{ nombre: 'Mancuernas', foto: null }] },
          ]
        },
      ],
      postentrenamiento: {
        repeticionesSerie: 1, descanso: 0,
        ejercicios: [{ nombre: 'Estiramiento espalda', reps: ['2 min'], descripcion: 'Estiramiento espalda.', video: '', utilitarios: [] }]
      },
    },
  ]
}

const MOCK_CLASES = [
  { id: 'kickboxing', nombre: 'Kickboxing', horario: 'Lun/Jue 21:00hs', habilitada: true },
  //{ id: 'funcional', nombre: 'Funcional', horario: 'Lun/Mié/Vie 19:00hs', habilitada: false },
  { id: 'gap', nombre: 'GAP', horario: 'Mar/Jue 15:00hs', habilitada: false },
]

const MOCK_HISTORIAL_DIAS = {
  '2026-04-20': { nombre: 'Día 1 — Piernas', tipo: 'rutina' },
  '2026-04-18': { nombre: 'Día 2 — Empuje', tipo: 'rutina' },
  '2026-04-16': { nombre: 'Día 3 — Tirón', tipo: 'rutina' },
  '2026-04-14': { nombre: 'Kickboxing', tipo: 'clase' },
  '2026-04-10': { nombre: 'Día 1 — Piernas', tipo: 'rutina' },
}


// ─── Página principal ─────────────────────────────────────
export default function AlumnoDashboard() {
  
  const [tabActiva, setTabActiva] = useState('musculacion')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])



  const rutina = MOCK_RUTINA



  return (
    <>
      {loading
        ? <Loader />
        : <div className={styles.page}>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tabActiva === 'musculacion' ? styles.tabActive : ''}`}
              onClick={() => setTabActiva('musculacion')}
            >
              💪 Musculación
            </button>
            {MOCK_CLASES.map(clase => (
              <button
                key={clase.id}
                className={`${styles.tab} ${tabActiva === clase.id ? styles.tabActive : ''} ${!clase.habilitada ? styles.tabDisabled : ''}`}
                onClick={() => { if (clase.habilitada) { setTabActiva(clase.id); setClaseRegistrada(false) } }}
                title={!clase.habilitada ? 'No estás inscripto en esta clase' : clase.horario}
              >
                🥊 {clase.nombre}
                {!clase.habilitada && <span className={styles.tabLock}>🔒</span>}
              </button>
            ))}
          </div>

          {tabActiva === 'musculacion' && (
            <div className={styles.contenido}>

              <HeaderRutina
                titulo={rutina.nombre}
                inicio={rutina.inicio}
                semanas={rutina.semanas}
                dias={rutina.dias.length}
              />
              {/* ── Días semana / Fecha seleccionada — se alternan en el mismo espacio ── */}

              <SelectorFecha
                historialDias={MOCK_HISTORIAL_DIAS}
              />

              <EntrenamientoRutina
                rutina={rutina}
              />
            </div>
          )}

          {tabActiva !== 'musculacion' && (
            <div className={styles.contenido}>
              <EntrenamientoClase
                listaClases={MOCK_CLASES}
                tabActiva={tabActiva}
                historialDias={MOCK_HISTORIAL_DIAS}
              />
            </div>
          )}






        </div>
      }
    </>
  )
}