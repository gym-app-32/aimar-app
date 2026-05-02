import { useState } from 'react'
import styles from './AlumnoEncuesta.module.scss'
import BodyMap from '../../components/UI/BodyMap/BodyMap'
import BodyMapWrapper from '../../components/UI/BodyMap/BodyMapWrapper'

// ─── Mock entrenamientos de hoy sin encuesta completada ───
const hoy = new Date().toISOString().split('T')[0]

const MOCK_ENTRENAMIENTOS_HOY = [
  {
    id: 1,
    tipo: 'rutina',
    nombre: 'Día 1 — Piernas',
    hora: '19:30',
    encuestaCompletada: false,
  },
  {
    id: 2,
    tipo: 'clase',
    nombre: 'Kickboxing Recreativo',
    hora: '21:00',
    encuestaCompletada: true, // ya completada — no se puede volver a hacer
  },
]

const PREGUNTAS = [
  {
    id: 'cansancio',
    label: 'Nivel de cansancio general',
    descripcion: '¿Cómo te sentís de energía después del entrenamiento?',
    iconoBajo: '😄',
    iconoAlto: '😴',
    labelBajo: 'Con energía',
    labelAlto: 'Agotado',
  },
  {
    id: 'dolor_muscular',
    label: 'Dolor muscular',
    descripcion: '¿Tenés agujetas o molestias musculares?',
    iconoBajo: '💪',
    iconoAlto: '🤕',
    labelBajo: 'Sin dolor',
    labelAlto: 'Mucho dolor',
  },
  {
    id: 'calidad_sueno',
    label: 'Calidad del sueño',
    descripcion: '¿Cómo dormiste anoche?',
    iconoBajo: '😴',
    iconoAlto: '😩',
    labelBajo: 'Muy bien',
    labelAlto: 'Muy mal',
  },
]

const EMPTY_FORM = {
  cansancio: null,
  dolor_muscular: null,
  calidad_sueno: null,
  musculos: [],
  notas: '',
}

// ─── Escala numérica 1-10 ─────────────────────────────────
function ScaleInput({ value, onChange }) {
  return (
    <div className={styles.scale}>
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          className={`
            ${styles.scaleBtn}
            ${value === n ? styles.selected : ''}
            ${value && n <= value ? styles.filled : ''}
          `}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

// ─── Formulario de encuesta ───────────────────────────────
function FormularioEncuesta({ entrenamiento, onEnviado, onCancelar }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const setRespuesta = (id, valor) => {
    setForm(p => ({ ...p, [id]: valor }))
    setError('')
  }

  const todosRespondidos = PREGUNTAS.every(p => form[p.id] !== null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!todosRespondidos) {
      setError('Por favor respondé todas las preguntas antes de enviar.')
      return
    }
    setEnviando(true)
    // await api.post('/alumno/encuestas', { entrenamientoId: entrenamiento.id, ...form })
    await new Promise(r => setTimeout(r, 800))
    setEnviando(false)
    onEnviado(entrenamiento.id)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formHeader}>
        <span className={`badge ${entrenamiento.tipo === 'rutina' ? 'badge--gold' : 'badge--success'}`}>
          {entrenamiento.tipo === 'rutina' ? '💪 Rutina' : '🥊 Clase'}
        </span>
        <span className={styles.formEntrenamientoNombre}>{entrenamiento.nombre}</span>
        <span className={styles.formHora}>🕐 {entrenamiento.hora}</span>
      </div>

      {PREGUNTAS.map((pregunta) => {
        const val = form[pregunta.id]
        return (
          <div key={pregunta.id} className={`card ${styles.preguntaCard}`}>
            <div className={styles.preguntaHeader}>
              <div>
                <h3 className={styles.preguntaLabel}>{pregunta.label}</h3>
                <p className={styles.preguntaDesc}>{pregunta.descripcion}</p>
              </div>
              {val && (
                <span className={styles.valorActual}>
                  {val}<span>/10</span>
                </span>
              )}
            </div>

            <ScaleInput
              value={val}
              onChange={(v) => setRespuesta(pregunta.id, v)}
            />

            <div className={styles.scaleLegend}>
              <span>{pregunta.iconoBajo} {pregunta.labelBajo}</span>
              <span>{pregunta.labelAlto} {pregunta.iconoAlto}</span>
            </div>
          </div>
        )
      })}

      <div className={`card ${styles.preguntaCard}`}>
        <div className={styles.preguntaHeader}>
          <div>
            <h3 className={styles.preguntaLabel}>Músculos fatigados</h3>
            <p className={styles.preguntaDesc}>¿Qué músculos sentís más cargados o doloridos?</p>
          </div>
        </div>
        <BodyMapWrapper
          genero="male"
          seleccionados={form.musculos}
          onChange={(musculos) => setForm(p => ({ ...p, musculos }))}
        />
      </div>

      <div className={`card ${styles.notasCard}`}>
        <label className={styles.notasLabel}>
          Comentarios <span>(opcional)</span>
        </label>
        <textarea
          className={styles.notasInput}
          value={form.notas}
          onChange={e => setForm(p => ({ ...p, notas: e.target.value }))}
          placeholder="¿Tenés algo puntual para contarle a tu profe? Lesiones, molestias, cómo te sentiste..."
          rows={3}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.formFooter}>
        <button type="button" className="btn btn--ghost" onClick={onCancelar}>
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn--primary btn--lg"
          disabled={enviando || !todosRespondidos}
        >
          {enviando ? 'Enviando...' : 'Enviar encuesta'}
        </button>
      </div>
    </form>
  )
}

// ─── Página principal ─────────────────────────────────────
export default function AlumnoEncuesta() {
  const [entrenamientos, setEntrenamientos] = useState(MOCK_ENTRENAMIENTOS_HOY)
  const [entrenamientoActivo, setEntrenamientoActivo] = useState(null)
  const [completados, setCompletados] = useState([])

  const handleEnviado = (entrenamientoId) => {
    setEntrenamientos(prev =>
      prev.map(e => e.id === entrenamientoId ? { ...e, encuestaCompletada: true } : e)
    )
    setCompletados(prev => [...prev, entrenamientoId])
    setEntrenamientoActivo(null)
  }

  const pendientes = entrenamientos.filter(e => !e.encuestaCompletada)
  const completadas = entrenamientos.filter(e => e.encuestaCompletada)

  // Si está completando una encuesta, mostrar el formulario
  if (entrenamientoActivo) {
    return (
      <div className={styles.page}>
        <div className="page-header">
          <h1>ENCUESTA DE <span>FATIGA</span></h1>
          <p>Contale a tu profe cómo te sentiste en este entrenamiento.</p>
        </div>
        <FormularioEncuesta
          entrenamiento={entrenamientoActivo}
          onEnviado={handleEnviado}
          onCancelar={() => setEntrenamientoActivo(null)}
        />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className="page-header">
        <h1>ENCUESTA DE <span>FATIGA</span></h1>
        <p>Completá una encuesta por cada entrenamiento de hoy.</p>
      </div>

      {/* Sin entrenamientos hoy */}
      {entrenamientos.length === 0 && (
        <div className={styles.vacio}>
          <span className={styles.vacioIcon}>📅</span>
          <p>No registraste entrenamientos hoy.</p>
        </div>
      )}

      {/* Pendientes */}
      {pendientes.length > 0 && (
        <div className={styles.seccion}>
          <h2 className={styles.seccionTitulo}>
            Pendientes <span className="badge badge--warning">{pendientes.length}</span>
          </h2>
          <div className={styles.lista}>
            {pendientes.map(ent => (
              <div key={ent.id} className={`card ${styles.entrenamientoCard}`}>
                <div className={styles.entrenamientoInfo}>
                  <span className={`badge ${ent.tipo === 'rutina' ? 'badge--gold' : 'badge--success'}`}>
                    {ent.tipo === 'rutina' ? '💪 Rutina' : '🥊 Clase'}
                  </span>
                  <div>
                    <span className={styles.entrenamientoNombre}>{ent.nombre}</span>
                    <span className={styles.entrenamientoHora}>🕐 {ent.hora}</span>
                  </div>
                </div>
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => setEntrenamientoActivo(ent)}
                >
                  Completar encuesta
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completadas */}
      {completadas.length > 0 && (
        <div className={styles.seccion}>
          <h2 className={styles.seccionTitulo}>
            Completadas <span className="badge badge--success">{completadas.length}</span>
          </h2>
          <div className={styles.lista}>
            {completadas.map(ent => (
              <div key={ent.id} className={`card ${styles.entrenamientoCard} ${styles.completada}`}>
                <div className={styles.entrenamientoInfo}>
                  <span className={`badge ${ent.tipo === 'rutina' ? 'badge--gold' : 'badge--success'}`}>
                    {ent.tipo === 'rutina' ? '💪 Rutina' : '🥊 Clase'}
                  </span>
                  <div>
                    <span className={styles.entrenamientoNombre}>{ent.nombre}</span>
                    <span className={styles.entrenamientoHora}>🕐 {ent.hora}</span>
                  </div>
                </div>
                <span className={styles.checkIcon}>✓ Enviada</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Todo completado */}
      {pendientes.length === 0 && completadas.length > 0 && (
        <div className={`card ${styles.successCard}`}>
          <span className={styles.successIcon}>✓</span>
          <div>
            <h3>¡Todo al día!</h3>
            <p>Completaste todas las encuestas de hoy. Tu profe ya puede ver tus resultados.</p>
          </div>
        </div>
      )}
    </div>
  )
}