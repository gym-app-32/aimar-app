import { useState } from 'react'
import styles from './FormularioEncuesta.module.scss'
import BodyMapWrapper from '../UI/BodyMap/BodyMapWrapper'

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
    label: 'Molestia muscular',
    descripcion: '¿Tenés o sentistes molestias o dolores musculares?',
    iconoBajo: '💪',
    iconoAlto: '🤕',
    labelBajo: 'Sin molestia',
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
    {
    id: 'calidad_alimentacion',
    label: 'Calidad alimentacion',
    descripcion: '¿Consideras que tu alimentacion previa, estubo acorde a tu entrenamiento de hoy?',
    iconoBajo: '😴',
    iconoAlto: '😩',
    labelBajo: 'Superavit calorico',
    labelAlto: 'Deficit calorico',
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


export default function FormularioEncuesta({ entrenamiento, onEnviado, onCancelar }) {
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
        <span className={styles.formHora}>📅 {entrenamiento.fecha} &nbsp;&nbsp;&nbsp;🕐 {entrenamiento.hora}</span>
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

