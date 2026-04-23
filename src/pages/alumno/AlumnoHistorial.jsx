import { useState } from 'react'
import Modal from '../../components/UI/Modal/Modal'
import styles from './AlumnoHistorial.module.scss'

// ─── Mock data ────────────────────────────────────────────
const MOCK_ENTRENAMIENTOS = [
  {
    fecha: '2025-01-20',
    tipo: 'rutina',
    label: 'Día 1 — Piernas',
    rutina: 'Fuerza + Hipertrofia',
    ejercicios: [
      { nombre: 'Sentadilla con barra', series: 4, reps: [8, 8, 7, 6] },
      { nombre: 'Prensa de piernas',    series: 3, reps: [12, 12, 10] },
      { nombre: 'Curl femoral',         series: 3, reps: [12, 10, 10] },
    ],
  },
  {
    fecha: '2025-01-18',
    tipo: 'clase',
    label: 'Kickboxing Recreativo',
    rutina: null,
    ejercicios: [],
  },
  {
    fecha: '2025-01-17',
    tipo: 'rutina',
    label: 'Día 2 — Empuje',
    rutina: 'Fuerza + Hipertrofia',
    ejercicios: [
      { nombre: 'Press de banca',       series: 4, reps: [10, 9, 8, 8] },
      { nombre: 'Press militar',        series: 3, reps: [10, 10, 8] },
      { nombre: 'Extensión de tríceps', series: 3, reps: [12, 12, 12] },
    ],
  },
  {
    fecha: '2025-01-15',
    tipo: 'rutina',
    label: 'Día 3 — Tirón',
    rutina: 'Fuerza + Hipertrofia',
    ejercicios: [
      { nombre: 'Remo con barra', series: 4, reps: [10, 10, 9, 8] },
      { nombre: 'Curl de bíceps', series: 3, reps: [12, 12, 10] },
    ],
  },
  {
    fecha: '2025-01-13',
    tipo: 'clase',
    label: 'Kickboxing Recreativo',
    rutina: null,
    ejercicios: [],
  },
  {
    fecha: '2025-01-13',
    tipo: 'rutina',
    label: 'Día 1 — Piernas',
    rutina: 'Fuerza + Hipertrofia',
    ejercicios: [
      { nombre: 'Sentadilla con barra', series: 4, reps: [8, 8, 8, 7] },
      { nombre: 'Prensa de piernas',    series: 3, reps: [12, 12, 12] },
    ],
  },
  {
    fecha: '2025-01-10',
    tipo: 'rutina',
    label: 'Día 2 — Empuje',
    rutina: 'Fuerza + Hipertrofia',
    ejercicios: [
      { nombre: 'Press de banca', series: 4, reps: [10, 10, 9, 8] },
    ],
  },
  {
    fecha: '2025-01-08',
    tipo: 'clase',
    label: 'Funcional',
    rutina: null,
    ejercicios: [],
  },
]

// ─── Helpers ──────────────────────────────────────────────
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function toKey(fecha) {
  return fecha // 'YYYY-MM-DD'
}

// Agrupa entrenamientos por fecha
function agruparPorFecha(entrenamientos) {
  return entrenamientos.reduce((acc, e) => {
    if (!acc[e.fecha]) acc[e.fecha] = []
    acc[e.fecha].push(e)
    return acc
  }, {})
}

// ─── Calendario ───────────────────────────────────────────
function Calendario({ año, mes, entrenamientosPorFecha, diaSeleccionado, onSelectDia }) {
  const primerDia = new Date(año, mes, 1).getDay()
  const diasEnMes = new Date(año, mes + 1, 0).getDate()
  const hoy = new Date().toISOString().split('T')[0]

  const celdas = []

  // Celdas vacías al inicio
  for (let i = 0; i < primerDia; i++) {
    celdas.push(<div key={`empty-${i}`} className={styles.celdaVacia} />)
  }

  for (let d = 1; d <= diasEnMes; d++) {
    const fecha = `${año}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const sesiones = entrenamientosPorFecha[fecha] || []
    const tieneRutina = sesiones.some(s => s.tipo === 'rutina')
    const tieneClase  = sesiones.some(s => s.tipo === 'clase')
    const esHoy       = fecha === hoy
    const seleccionado = diaSeleccionado === fecha

    celdas.push(
      <div
        key={fecha}
        className={`
          ${styles.celda}
          ${sesiones.length > 0 ? styles.celdaActiva : ''}
          ${esHoy ? styles.celdaHoy : ''}
          ${seleccionado ? styles.celdaSeleccionada : ''}
        `}
        onClick={() => sesiones.length > 0 && onSelectDia(seleccionado ? null : fecha)}
      >
        <span className={styles.celdaNum}>{d}</span>
        {sesiones.length > 0 && (
          <div className={styles.celdaDots}>
            {tieneRutina && <span className={styles.dotRutina} />}
            {tieneClase  && <span className={styles.dotClase} />}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.calendario}>
      <div className={styles.calGrid}>
        {DIAS_SEMANA.map(d => (
          <div key={d} className={styles.calDiaSemana}>{d}</div>
        ))}
        {celdas}
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────
export default function AlumnoHistorial() {
  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth())
  const [año, setAño] = useState(hoy.getFullYear())
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)
  const [sesionDetalle, setSesionDetalle] = useState(null)

  const entrenamientosPorFecha = agruparPorFecha(MOCK_ENTRENAMIENTOS)

  const irMesAnterior = () => {
    if (mes === 0) { setMes(11); setAño(a => a - 1) }
    else setMes(m => m - 1)
    setDiaSeleccionado(null)
  }

  const irMesSiguiente = () => {
    if (mes === 11) { setMes(0); setAño(a => a + 1) }
    else setMes(m => m + 1)
    setDiaSeleccionado(null)
  }

  const sesionesDia = diaSeleccionado ? (entrenamientosPorFecha[diaSeleccionado] || []) : []

  const totalMes = Object.keys(entrenamientosPorFecha).filter(f =>
    f.startsWith(`${año}-${String(mes + 1).padStart(2, '0')}`)
  ).reduce((acc, f) => acc + entrenamientosPorFecha[f].length, 0)

  const formatFechaLarga = (str) => {
    const d = new Date(str + 'T00:00:00')
    return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  return (
    <div className={styles.page}>
      <div className="page-header">
        <h1>MI <span>HISTORIAL</span></h1>
        <p>Tus entrenamientos registrados mes a mes.</p>
      </div>

      <div className={styles.layout}>

        {/* ── Calendario ── */}
        <div className={`card ${styles.calCard}`}>
          <div className={styles.calHeader}>
            <button className={styles.calNav} onClick={irMesAnterior}>←</button>
            <span className={styles.calTitulo}>
              {MESES[mes]} {año}
            </span>
            <button className={styles.calNav} onClick={irMesSiguiente}>→</button>
          </div>

          <Calendario
            año={año}
            mes={mes}
            entrenamientosPorFecha={entrenamientosPorFecha}
            diaSeleccionado={diaSeleccionado}
            onSelectDia={setDiaSeleccionado}
          />

          <div className={styles.leyenda}>
            <span className={styles.leyendaItem}>
              <span className={styles.dotRutina} /> Rutina
            </span>
            <span className={styles.leyendaItem}>
              <span className={styles.dotClase} /> Clase
            </span>
          </div>

          <div className={styles.resumenMes}>
            <span className={styles.resumenMesNum}>{totalMes}</span>
            <span className={styles.resumenMesLabel}>
              entrenamiento{totalMes !== 1 ? 's' : ''} en {MESES[mes]}
            </span>
          </div>
        </div>

        {/* ── Panel derecho ── */}
        <div className={styles.panelDerecho}>
          {diaSeleccionado ? (
            <div className={styles.diaDetalle}>
              <h2 className={styles.diaDetalleTitle}>
                {formatFechaLarga(diaSeleccionado)}
              </h2>
              <div className={styles.sesionesDelDia}>
                {sesionesDia.map((sesion, i) => (
                  <div
                    key={i}
                    className={`card ${styles.sesionCard} ${sesion.tipo === 'clase' ? styles.sesionClase : styles.sesionRutina}`}
                    onClick={() => sesion.ejercicios.length > 0 && setSesionDetalle(sesion)}
                  >
                    <div className={styles.sesionHeader}>
                      <span className={`badge ${sesion.tipo === 'rutina' ? 'badge--gold' : 'badge--success'}`}>
                        {sesion.tipo === 'rutina' ? 'Rutina' : 'Clase'}
                      </span>
                      {sesion.ejercicios.length > 0 && (
                        <span className={styles.sesionVerDetalle}>Ver detalle →</span>
                      )}
                    </div>
                    <span className={styles.sesionLabel}>{sesion.label}</span>
                    {sesion.rutina && (
                      <span className={styles.sesionRutinaName}>{sesion.rutina}</span>
                    )}
                    {sesion.ejercicios.length > 0 && (
                      <span className={styles.sesionEjCount}>
                        {sesion.ejercicios.length} ejercicio{sesion.ejercicios.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.sinSeleccion}>
              <span className={styles.sinSeleccionIcon}>📅</span>
              <p>Seleccioná un día con entrenamiento para ver el detalle.</p>
            </div>
          )}

          {/* Lista cronológica */}
          <h3 className={styles.listaTitle}>ÚLTIMOS ENTRENAMIENTOS</h3>
          <div className={styles.listaEntrenamientos}>
            {MOCK_ENTRENAMIENTOS.map((e, i) => (
              <div
                key={i}
                className={`card ${styles.listaItem}`}
                onClick={() => e.ejercicios.length > 0 && setSesionDetalle(e)}
              >
                <div className={styles.listaItemLeft}>
                  <span className={styles.listaFecha}>
                    {new Date(e.fecha + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                  </span>
                  <div>
                    <span className={styles.listaLabel}>{e.label}</span>
                    {e.rutina && <span className={styles.listaRutina}>{e.rutina}</span>}
                  </div>
                </div>
                <div className={styles.listaItemRight}>
                  <span className={`badge ${e.tipo === 'rutina' ? 'badge--gold' : 'badge--success'}`}>
                    {e.tipo === 'rutina' ? 'Rutina' : 'Clase'}
                  </span>
                  {e.ejercicios.length > 0 && (
                    <span className={styles.listaArrow}>→</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modal detalle sesión ── */}
      <Modal
        isOpen={!!sesionDetalle}
        onClose={() => setSesionDetalle(null)}
        title={sesionDetalle?.label?.toUpperCase() || ''}
        maxWidth="480px"
      >
        {sesionDetalle && (
          <div className={styles.detalle}>
            <div className={styles.detalleMeta}>
              <span className={`badge ${sesionDetalle.tipo === 'rutina' ? 'badge--gold' : 'badge--success'}`}>
                {sesionDetalle.tipo === 'rutina' ? 'Rutina' : 'Clase'}
              </span>
              {sesionDetalle.rutina && (
                <span className={styles.detalleRutina}>{sesionDetalle.rutina}</span>
              )}
              <span className={styles.detalleFecha}>
                {formatFechaLarga(sesionDetalle.fecha)}
              </span>
            </div>

            {sesionDetalle.ejercicios.length > 0 && (
              <div className={styles.detalleEjercicios}>
                {sesionDetalle.ejercicios.map((ej, i) => (
                  <div key={i} className={styles.detalleEjercicio}>
                    <div className={styles.detalleEjHeader}>
                      <span className={styles.detalleEjNombre}>{ej.nombre}</span>
                      <span className={styles.detalleEjSeries}>{ej.series} series</span>
                    </div>
                    <div className={styles.detalleRepsRow}>
                      {ej.reps.map((r, ri) => (
                        <div key={ri} className={styles.detalleRepChip}>
                          <span className={styles.detalleRepLabel}>S{ri + 1}</span>
                          <span className={styles.detalleRepVal}>{r} reps</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}