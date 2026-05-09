import { useEffect, useState } from 'react'
import styles from './AlumnoHistorial.module.scss'
import Loader from '../../components/Loader/Loader'
import CalendarioHistorial from '../../components/CalendarioHistorial/CalendarioHistorial'
import DetallesDiaSeleccionado from '../../components/DetallesDiaSeleccionado/DetallesDiaSeleccionado'

// ─── Mock data ────────────────────────────────────────────
const MOCK_ENTRENAMIENTOS = [
 
  {
    id: 2,
    fecha: '2026-04-20',
    hora: '21:00',
    tipo: 'clase',
    nombre: 'Kickboxing Recreativo',
    rutina: null,
    duracion: 60,
    ejercicios: [],
    fatiga: { cansancio: 8, dolorMuscular: 5, sueno: 4 },
  },
  {
    id: 3,
    fecha: '2026-04-18',
    hora: '19:15',
    tipo: 'rutina',
    nombre: 'Día 2 — Empuje',
    rutina: 'Fuerza + Hipertrofia',
    duracion: 50,
    ejercicios: [
      { nombre: 'Press de banca', series: [{ reps: [8, 8, 7] }] },
      { nombre: 'Press militar', series: [{ reps: [10, 10, 8] }] },
      { nombre: 'Extensión tríceps', series: [{ reps: [12, 12, 12] }] },
    ],
    fatiga: { cansancio: 5, dolorMuscular: 4, sueno: 7 },
  },
  {
    id: 4,
    fecha: '2026-04-16',
    hora: '19:00',
    tipo: 'rutina',
    nombre: 'Día 3 — Tirón',
    rutina: 'Fuerza + Hipertrofia',
    duracion: 52,
    ejercicios: [
      { nombre: 'Remo con barra', series: [{ reps: [8, 8, 8] }] },
      { nombre: 'Curl de bíceps', series: [{ reps: [12, 12, 10] }] },
    ],
    fatiga: { cansancio: 4, dolorMuscular: 3, sueno: 8 },
  },
  {
    id: 5,
    fecha: '2026-04-15',
    hora: '21:00',
    tipo: 'clase',
    nombre: 'Kickboxing Recreativo',
    rutina: null,
    duracion: 60,
    ejercicios: [],
    fatiga: { cansancio: 6, dolorMuscular: 4, sueno: 6 },
  },
  {
    id: 6,
    fecha: '2026-04-13',
    hora: '19:30',
    tipo: 'rutina',
    nombre: 'Día 1 — Piernas',
    rutina: 'Fuerza + Hipertrofia',
    duracion: 58,
    ejercicios: [
      { nombre: 'Sentadilla con barra', series: [{ reps: [8, 8, 8, 7] }] },
      { nombre: 'Prensa de piernas', series: [{ reps: [12, 12, 12] }] },
    ],
    fatiga: { cansancio: 6, dolorMuscular: 7, sueno: 5 },
  },
  {
    id: 7,
    fecha: '2026-04-08',
    hora: '19:00',
    tipo: 'rutina',
    nombre: 'Día 2 — Empuje',
    rutina: 'Fuerza + Hipertrofia',
    duracion: 48,
    ejercicios: [
      { nombre: 'Press de banca', series: [{ reps: [8, 7, 7] }] },
      { nombre: 'Press militar', series: [{ reps: [10, 9, 8] }] },
    ],
    fatiga: { cansancio: 5, dolorMuscular: 3, sueno: 7 },
  },
]

// ─── Helpers ──────────────────────────────────────────────
function getEntrenamientosPorFecha(fecha) {
  return MOCK_ENTRENAMIENTOS.filter(e => e.fecha === fecha)
}





// ─── StarsCards ──────────────────────
const StartCard = ({ num = '', label = '' }) => {
  return (
    <div className={`card ${styles.statCard}`}>
      <span className={styles.statValue}>{num}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────
export default function AlumnoHistorial() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Definimos el temporizador (ejemplo: 1 segundos)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Limpieza: si el componente se desmonta antes de los 3s, 
    // cancelamos el timer para evitar errores.
    return () => clearTimeout(timer);
  }, []);


  const [fechaSeleccionada, setFechaSeleccionada] = useState(null)

  const entrenamientosDelDia = fechaSeleccionada
    ? getEntrenamientosPorFecha(fechaSeleccionada)
    : []

  const totalEntrenamientos = MOCK_ENTRENAMIENTOS.length
  const totalMinutos = MOCK_ENTRENAMIENTOS.reduce((a, e) => a + e.duracion, 0)
  const diasUnicos = new Set(MOCK_ENTRENAMIENTOS.map(e => e.fecha)).size

  return (
    <>
      {loading
        ? <Loader />
        : <div className={styles.page}>
          <div className="page-header">
            <h1>MI <span>HISTORIAL</span></h1>
            <p>Revisá tus entrenamientos pasados.</p>
          </div>

          {/* Stars */}
          <div className={styles.statsRow}>
            <StartCard num={totalEntrenamientos} label="Entrenamientos" />
            <StartCard num={diasUnicos} label="Días activos" />
            <StartCard num={`${Math.round(totalMinutos / 60)}h`} label="Total entrenado" />
          </div>

          {/* Layout principal */}
          <div className={styles.layout}>
            <CalendarioHistorial
              fechaSeleccionada={fechaSeleccionada}
              onSelectFecha={setFechaSeleccionada}
              listaEntrenamientos={MOCK_ENTRENAMIENTOS}
            />
            <DetallesDiaSeleccionado 
              fecha={fechaSeleccionada}
              entrenamientos={entrenamientosDelDia}
            />
          </div>
        </div>
      }
    </>
  )
}