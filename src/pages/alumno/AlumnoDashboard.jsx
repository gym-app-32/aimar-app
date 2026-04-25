import { useState, useRef } from 'react'
import styles from './AlumnoDashboard.module.scss'

// ─── Mock data ────────────────────────────────────────────
const MOCK_RUTINA = {
  nombre: 'Fuerza + Hipertrofia',
  inicio: '2026-04-01',
  semanas: 6,
  semanaActual: 3,
  dias: [
    {
      id: 1,
      nombre: 'Piernas',
      gruposMusculares: 'Cuádriceps, Glúteos, Isquiotibiales',
      precalentamiento: {
        repeticionesSerie: 1,
        descanso: 0,
        ejercicios: [
          { nombre: 'Bicicleta estática', reps: ['10 min'] },
          { nombre: 'Salto a la soga',    reps: ['5 min'] },
        ]
      },
      series: [
        {
          id: 1,
          repeticionesSerie: 4,
          descanso: 90,
          ejercicios: [
            { nombre: 'Sentadilla con barra', reps: [8, 8, 7, 6] },
            { nombre: 'Prensa de piernas',    reps: [12, 12, 10, 10] },
          ]
        },
        {
          id: 2,
          repeticionesSerie: 3,
          descanso: 60,
          ejercicios: [
            { nombre: 'Curl femoral',     reps: [12, 12, 12] },
            { nombre: 'Extensión de pierna', reps: [15, 15, 12] },
          ]
        },
      ],
      postentrenamiento: {
        repeticionesSerie: 1,
        descanso: 0,
        ejercicios: [
          { nombre: 'Estiramiento cuádriceps', reps: ['2 min'] },
          { nombre: 'Estiramiento isquios',    reps: ['2 min'] },
        ]
      },
    },
    {
      id: 2,
      nombre: 'Empuje',
      gruposMusculares: 'Pecho, Hombros, Tríceps',
      precalentamiento: {
        repeticionesSerie: 1,
        descanso: 0,
        ejercicios: [
          { nombre: 'Soga de saltar', reps: ['5 min'] },
        ]
      },
      series: [
        {
          id: 1,
          repeticionesSerie: 4,
          descanso: 90,
          ejercicios: [
            { nombre: 'Press de banca',  reps: [8, 8, 7, 6] },
            { nombre: 'Press militar',   reps: [10, 10, 8, 8] },
          ]
        },
        {
          id: 2,
          repeticionesSerie: 3,
          descanso: 60,
          ejercicios: [
            { nombre: 'Extensión tríceps', reps: [12, 12, 12] },
          ]
        },
      ],
      postentrenamiento: {
        repeticionesSerie: 1,
        descanso: 0,
        ejercicios: [
          { nombre: 'Estiramiento pecho', reps: ['2 min'] },
        ]
      },
    },
    {
      id: 3,
      nombre: 'Tirón',
      gruposMusculares: 'Espalda, Bíceps, Trapecios',
      precalentamiento: {
        repeticionesSerie: 1,
        descanso: 0,
        ejercicios: [
          { nombre: 'Bicicleta estática', reps: ['8 min'] },
        ]
      },
      series: [
        {
          id: 1,
          repeticionesSerie: 4,
          descanso: 90,
          ejercicios: [
            { nombre: 'Remo con barra', reps: [8, 8, 8, 6] },
            { nombre: 'Jalón al pecho', reps: [10, 10, 10, 8] },
          ]
        },
        {
          id: 2,
          repeticionesSerie: 3,
          descanso: 60,
          ejercicios: [
            { nombre: 'Curl de bíceps', reps: [12, 12, 10] },
          ]
        },
      ],
      postentrenamiento: {
        repeticionesSerie: 1,
        descanso: 0,
        ejercicios: [
          { nombre: 'Estiramiento espalda', reps: ['2 min'] },
        ]
      },
    },
  ]
}

const MOCK_CLASES = [
  { id: 'kickboxing', nombre: 'Kickboxing Recreativo', horario: 'Lun/Jue 21:00hs', habilitada: true },
  { id: 'funcional',  nombre: 'Funcional',             horario: 'Lun/Mié/Vie 19:00hs', habilitada: false },
  { id: 'gap',        nombre: 'GAP',                   horario: 'Mar/Jue 15:00hs', habilitada: false },
]

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function getDiaSemanaActual() {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

function formatFecha(str) {
  const d = new Date(str + 'T00:00:00')
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── Indicador de semanas ─────────────────────────────────
function SemanaIndicador({ semanaActual, totalSemanas }) {
  const progresoPct = ((semanaActual - 1) / totalSemanas) * 100

  return (
    <div className={styles.semanaIndicador}>
      <div className={styles.semanaBarras}>
        {Array.from({ length: totalSemanas }, (_, i) => {
          const num = i + 1
          const completada = num < semanaActual
          const enProceso = num === semanaActual
          const pendiente = num > semanaActual

          return (
            <div
              key={num}
              className={`${styles.semanaBarraWrapper} ${enProceso ? styles.enProceso : ''}`}
            >
              <div className={styles.semanaNum}>S{num}</div>
              <div className={styles.semanaBarra}>
                <div
                  className={`${styles.semanaBarraFill}
                    ${completada ? styles.completada : ''}
                    ${enProceso ? styles.enProcesoFill : ''}
                    ${pendiente ? styles.pendiente : ''}
                  `}
                  style={enProceso ? { width: `${((getDiaSemanaActual() + 1) / 7) * 100}%` } : {}}
                />
              </div>
            </div>
          )
        })}
      </div>
      <span className={styles.semanaLabel}>
        Semana {semanaActual} de {totalSemanas}
      </span>
    </div>
  )
}

// ─── Carrusel de series ───────────────────────────────────
function CarruselSeries({ dia, onCompletado }) {
  const bloques = [
    { tipo: 'pre',   data: dia.precalentamiento,  titulo: '🔥 Precalentamiento',  color: '#f0a500' },
    ...dia.series.map((s, i) => ({ tipo: 'serie', data: s, titulo: `💪 Serie ${i + 1}`, color: '#F5C518' })),
    { tipo: 'post',  data: dia.postentrenamiento, titulo: '🧘 Post-entrenamiento', color: '#52c07a' },
  ]

  const [indiceActual, setIndiceActual] = useState(0)
  const [completados, setCompletados] = useState([])
  const [guardado, setGuardado] = useState(false)
  const carruselRef = useRef(null)

  const bloque = bloques[indiceActual]
  const esUltimo = indiceActual === bloques.length - 1
  const esteCompletado = completados.includes(indiceActual)

  const marcarCompletado = async () => {
    const nuevosCompletados = [...completados, indiceActual]
    setCompletados(nuevosCompletados)

    if (esUltimo) {
      // Guardado automático
      await new Promise(r => setTimeout(r, 800))
      setGuardado(true)
      onCompletado()
    } else {
      setTimeout(() => {
        setIndiceActual(p => p + 1)
        carruselRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 400)
    }
  }

  if (guardado) {
    return (
      <div className={styles.entrenamientoGuardado}>
        <span className={styles.guardadoIcon}>✓</span>
        <h3>¡Entrenamiento completado!</h3>
        <p>Tu progreso fue registrado. ¡Excelente trabajo!</p>
      </div>
    )
  }

  return (
    <div className={styles.carrusel} ref={carruselRef}>
      {/* Indicador de progreso */}
      <div className={styles.carruselProgress}>
        {bloques.map((b, i) => (
          <div
            key={i}
            className={`${styles.carruselDot}
              ${i === indiceActual ? styles.carruselDotActive : ''}
              ${completados.includes(i) ? styles.carruselDotDone : ''}
            `}
          />
        ))}
      </div>

      {/* Tarjeta actual */}
      <div
        className={styles.serieCard}
        style={{ borderColor: bloque.color + '44' }}
      >
        <div className={styles.serieCardHeader} style={{ borderColor: bloque.color + '22' }}>
          <span className={styles.serieTitulo} style={{ color: bloque.color }}>
            {bloque.titulo}
          </span>
          {bloque.data.descanso > 0 && (
            <span className={styles.serieDescanso}>
              ⏱ {bloque.data.descanso}s descanso
            </span>
          )}
          {bloque.data.repeticionesSerie > 1 && (
            <span className={styles.serieCantidad}>
              × {bloque.data.repeticionesSerie} series
            </span>
          )}
        </div>

        <div className={styles.ejerciciosList}>
          {bloque.data.ejercicios.map((ej, i) => (
            <div key={i} className={styles.ejercicioItem}>
              <span className={styles.ejercicioNum}>{i + 1}</span>
              <div className={styles.ejercicioInfo}>
                <span className={styles.ejercicioNombre}>{ej.nombre}</span>
                <div className={styles.repsRow}>
                  {ej.reps.map((r, ri) => (
                    <div key={ri} className={styles.repItem}>
                      {bloque.data.repeticionesSerie > 1 && (
                        <span className={styles.repSerie}>S{ri + 1}</span>
                      )}
                      <span className={styles.repValor}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className={styles.completarBtn}
          style={{ background: esteCompletado ? '#333' : bloque.color }}
          onClick={marcarCompletado}
          disabled={esteCompletado}
        >
          {esteCompletado
            ? '✓ Completado'
            : esUltimo
              ? '✓ Finalizar entrenamiento'
              : 'Completado → Siguiente'
          }
        </button>
      </div>

      {/* Miniaturas */}
      <div className={styles.miniaturas}>
        {bloques.map((b, i) => (
          <button
            key={i}
            className={`${styles.miniatura}
              ${i === indiceActual ? styles.miniaturaActive : ''}
              ${completados.includes(i) ? styles.miniaturaDone : ''}
            `}
            onClick={() => setIndiceActual(i)}
          >
            <span>{b.titulo.split(' ').slice(0, 2).join(' ')}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────
export default function AlumnoDashboard() {
  const [tabActiva, setTabActiva] = useState('musculacion')
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)
  const [entrenamientoIniciado, setEntrenamientoIniciado] = useState(false)
  const [entrenamientoCompletado, setEntrenamientoCompletado] = useState(false)

  const diaActual = getDiaSemanaActual()
  const rutina = MOCK_RUTINA

  const handleSeleccionarDia = (dia) => {
    setDiaSeleccionado(dia)
    setEntrenamientoIniciado(false)
    setEntrenamientoCompletado(false)
  }

  const handleCompletado = () => {
    setEntrenamientoCompletado(true)
  }

  return (
    <div className={styles.page}>
      {/* ── Tabs ── */}
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
            onClick={() => clase.habilitada && setTabActiva(clase.id)}
            title={!clase.habilitada ? 'No estás inscripto en esta clase' : clase.horario}
          >
            🥊 {clase.nombre}
            {!clase.habilitada && <span className={styles.tabLock}>🔒</span>}
          </button>
        ))}
      </div>

      {/* ── Tab Musculación ── */}
      {tabActiva === 'musculacion' && (
        <div className={styles.contenido}>

          {/* Encabezado rutina */}
          <div className={`card ${styles.rutinaHeader}`}>
            <div className={styles.rutinaHeaderTop}>
              <div>
                <h2 className={styles.rutinaNombre}>{rutina.nombre}</h2>
                <div className={styles.rutinaMeta}>
                  <span>📅 Inicio: {formatFecha(rutina.inicio)}</span>
                  <span>⏳ {rutina.semanas} semanas</span>
                  <span>📋 {rutina.dias.length} días</span>
                </div>
              </div>
              <span className="badge badge--gold">Activa</span>
            </div>
            <SemanaIndicador
              semanaActual={rutina.semanaActual}
              totalSemanas={rutina.semanas}
            />
          </div>

          {/* Días de la semana */}
          <div className={styles.diasSemana}>
            {DIAS_SEMANA.map((dia, i) => (
              <div
                key={dia}
                className={`${styles.diaSemana} ${i === diaActual ? styles.diaHoy : ''}`}
              >
                <span className={styles.diaSemanaLabel}>{dia}</span>
                {i === diaActual && (
                  <div className={styles.diaHoyDot} />
                )}
              </div>
            ))}
          </div>

          {/* Selector de día de la rutina */}
          <div className={styles.selectorDias}>
            <span className={styles.selectorLabel}>Elegí el día a entrenar:</span>
            <div className={styles.selectorBtns}>
              {rutina.dias.map((dia) => (
                <button
                  key={dia.id}
                  className={`${styles.selectorBtn} ${diaSeleccionado?.id === dia.id ? styles.selectorBtnActive : ''}`}
                  onClick={() => handleSeleccionarDia(dia)}
                >
                  <span className={styles.selectorBtnNum}>Día {dia.id}</span>
                  <span className={styles.selectorBtnNombre}>{dia.nombre}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Carrusel */}
          {diaSeleccionado && !entrenamientoIniciado && (
            <div className={`card ${styles.iniciarCard}`}>
              <div className={styles.iniciarInfo}>
                <h3 className={styles.iniciarNombre}>
                  Día {diaSeleccionado.id} — {diaSeleccionado.nombre}
                </h3>
                <p className={styles.iniciarMusculos}>
                  {diaSeleccionado.gruposMusculares}
                </p>
                <div className={styles.iniciarMeta}>
                  <span>💪 {diaSeleccionado.series.length} series de trabajo</span>
                  <span>⏱ ~{diaSeleccionado.series.reduce((a, s) => a + s.repeticionesSerie * 3, 10)} min estimado</span>
                </div>
              </div>
              <button
                className="btn btn--primary btn--lg"
                onClick={() => setEntrenamientoIniciado(true)}
              >
                Iniciar entrenamiento →
              </button>
            </div>
          )}

          {diaSeleccionado && entrenamientoIniciado && (
            <CarruselSeries
              dia={diaSeleccionado}
              onCompletado={handleCompletado}
            />
          )}
        </div>
      )}

      {/* ── Tab Clases ── */}
      {tabActiva !== 'musculacion' && (
        <div className={styles.contenido}>
          {MOCK_CLASES.filter(c => c.id === tabActiva).map(clase => (
            <div key={clase.id} className={`card ${styles.claseCard}`}>
              <h2 className={styles.claseNombre}>{clase.nombre}</h2>
              <p className={styles.claseHorario}>📅 {clase.horario}</p>
              <p className={styles.claseInfo}>
                Registrá tu asistencia a la clase de hoy.
              </p>
              <button className="btn btn--primary">
                ✓ Registrar asistencia
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}