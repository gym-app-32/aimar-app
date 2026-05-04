import { useEffect, useState } from 'react'
import styles from './AlumnoHistorial.module.scss'
import Loader from '../../components/Loader/Loader'

// ─── Mock data ────────────────────────────────────────────
const MOCK_ENTRENAMIENTOS = [
  {
    id: 1,
    fecha: '2026-04-20',
    hora: '19:30',
    tipo: 'rutina',
    nombre: 'Día 1 — Piernas',
    rutina: 'Fuerza + Hipertrofia',
    duracion: 55,
    ejercicios: [
      { nombre: 'Sentadilla con barra', series: [{ reps: [8, 8, 7, 6] }] },
      { nombre: 'Prensa de piernas', series: [{ reps: [12, 12, 10] }] },
      { nombre: 'Curl femoral', series: [{ reps: [12, 12, 12] }] },
    ],
    fatiga: { cansancio: 7, dolorMuscular: 6, sueno: 4 },
  },
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
const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function getFechasConEntrenamiento() {
  return new Set(MOCK_ENTRENAMIENTOS.map(e => e.fecha))
}

function getEntrenamientosPorFecha(fecha) {
  return MOCK_ENTRENAMIENTOS.filter(e => e.fecha === fecha)
}

function formatFecha(str) {
  const d = new Date(str + 'T00:00:00')
  return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function FatigaBadge({ valor, label }) {
  const color = valor <= 4 ? 'success' : valor <= 7 ? 'warning' : 'error'
  return (
    <div className={styles.fatigaItem}>
      <span className={styles.fatigaLabel}>{label}</span>
      <span className={`badge badge--${color}`}>{valor}/10</span>
    </div>
  )
}

// ─── Calendario ───────────────────────────────────────────
function Calendario({ año, mes, fechaSeleccionada, onSelectFecha, onCambiarMes }) {
  const fechasConEntrenamiento = getFechasConEntrenamiento()

  const primerDia = new Date(año, mes, 1).getDay()
  const diasEnMes = new Date(año, mes + 1, 0).getDate()

  const celdas = []
  for (let i = 0; i < primerDia; i++) celdas.push(null)
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d)

  return (
    <div className={styles.calendario}>
      <div className={styles.calHeader}>
        <button className={styles.calNavBtn} onClick={() => onCambiarMes(-1)}>‹</button>
        <span className={styles.calMes}>{MESES[mes]} {año}</span>
        <button className={styles.calNavBtn} onClick={() => onCambiarMes(1)}>›</button>
      </div>

      <div className={styles.calGrid}>
        {DIAS_SEMANA.map(d => (
          <div key={d} className={styles.calDiaNombre}>{d}</div>
        ))}
        {celdas.map((dia, i) => {
          if (!dia) return <div key={`empty-${i}`} />
          const fechaStr = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
          const tieneEntrenamiento = fechasConEntrenamiento.has(fechaStr)
          const seleccionado = fechaStr === fechaSeleccionada
          const hoy = new Date().toISOString().split('T')[0] === fechaStr

          return (
            <div
              key={dia}
              className={`
                ${styles.calDia}
                ${tieneEntrenamiento ? styles.calDiaCon : ''}
                ${seleccionado ? styles.calDiaSeleccionado : ''}
                ${hoy ? styles.calDiaHoy : ''}
              `}
              onClick={() => tieneEntrenamiento && onSelectFecha(fechaStr)}
            >
              <span>{dia}</span>
              {tieneEntrenamiento && (
                <div className={styles.calDot} />
              )}
            </div>
          )
        })}
      </div>

      <div className={styles.calLeyenda}>
        <div className={styles.calLeyendaItem}>
          <div className={styles.calDot} />
          <span>Entrenamiento</span>
        </div>
        <div className={styles.calLeyendaItem}>
          <div className={`${styles.calDiaHoyDot}`} />
          <span>Hoy</span>
        </div>
      </div>
    </div>
  )
}

// ─── Detalle del día ──────────────────────────────────────
function DetalleDia({ fecha, entrenamientos }) {
  const [expandido, setExpandido] = useState(null)

  if (!fecha) {
    return (
      <div className={styles.detalleVacio}>
        <span className={styles.detalleVacioIcon}>📅</span>
        <p>Seleccioná un día con entrenamientos para ver el detalle.</p>
      </div>
    )
  }

  if (entrenamientos.length === 0) {
    return (
      <div className={styles.detalleVacio}>
        <span className={styles.detalleVacioIcon}>😴</span>
        <p>No hubo entrenamientos este día.</p>
      </div>
    )
  }

  return (
    <div className={styles.detalle}>
      <h3 className={styles.detalleFecha}>{formatFecha(fecha)}</h3>

      {entrenamientos.map(ent => (
        <div key={ent.id} className={`card ${styles.entrenamientoCard}`}>
          <div
            className={styles.entrenamientoHeader}
            onClick={() => setExpandido(expandido === ent.id ? null : ent.id)}
          >
            <div className={styles.entrenamientoLeft}>
              <span className={`badge ${ent.tipo === 'rutina' ? 'badge--gold' : 'badge--success'}`}>
                {ent.tipo === 'rutina' ? '💪 Rutina' : '🥊 Clase'}
              </span>
              <div>
                <span className={styles.entrenamientoNombre}>{ent.nombre}</span>
                {ent.rutina && (
                  <span className={styles.entrenamientoRutina}>{ent.rutina}</span>
                )}
              </div>
            </div>
            <div className={styles.entrenamientoRight}>
              <span className={styles.entrenamientoMeta}>🕐 {ent.hora}</span>
              <span className={styles.entrenamientoMeta}>⏱ {ent.duracion} min</span>
              <span className={styles.expandBtn}>
                {expandido === ent.id ? '▲' : '▼'}
              </span>
            </div>
          </div>

          {expandido === ent.id && (
            <div className={styles.entrenamientoDetalle}>

              {/* Ejercicios */}
              {ent.ejercicios.length > 0 && (
                <div className={styles.ejerciciosList}>
                  <span className={styles.detalleSeccion}>Ejercicios</span>
                  {ent.ejercicios.map((ej, i) => (
                    <div key={i} className={styles.ejercicioItem}>
                      <span className={styles.ejercicioNombre}>{ej.nombre}</span>
                      <div className={styles.ejercicioSeries}>
                        {ej.series.map((s, si) => (
                          <div key={si} className={styles.serieReps}>
                            {s.reps.map((r, ri) => (
                              <span key={ri} className={styles.repBubble}>
                                {r}
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Fatiga */}
              {ent.fatiga && (
                <div className={styles.fatigaSection}>
                  <span className={styles.detalleSeccion}>Encuesta de fatiga</span>
                  <div className={styles.fatigaGrid}>
                    <FatigaBadge valor={ent.fatiga.cansancio} label="Cansancio" />
                    <FatigaBadge valor={ent.fatiga.dolorMuscular} label="Dolor muscular" />
                    <FatigaBadge valor={ent.fatiga.sueno} label="Calidad de sueño" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
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



  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth())
  const [año, setAño] = useState(hoy.getFullYear())
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null)

  const cambiarMes = (dir) => {
    const nuevaFecha = new Date(año, mes + dir, 1)
    setMes(nuevaFecha.getMonth())
    setAño(nuevaFecha.getFullYear())
    setFechaSeleccionada(null)
  }

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
            <Calendario
              año={año}
              mes={mes}
              fechaSeleccionada={fechaSeleccionada}
              onSelectFecha={setFechaSeleccionada}
              onCambiarMes={cambiarMes}
            />
            <DetalleDia
              fecha={fechaSeleccionada}
              entrenamientos={entrenamientosDelDia}
            />
          </div>
        </div>
      }
    </>
  )
}