import { useState } from 'react'
import Modal from '../../components/UI/Modal/Modal'
import styles from './ProfesorDashboard.module.scss'

// ─── Mock data ────────────────────────────────────────────
const MOCK_ALUMNOS = [
  { id: 1, nombre: 'Carlos Pérez',   rutina: { id: 1, nombre: 'Fuerza + Hipertrofia', inicio: '2025-01-01', semanas: 8,  dias: [] }, activo: true },
  { id: 2, nombre: 'Sofía López',    rutina: { id: 2, nombre: 'Funcional Full Body',  inicio: '2025-01-06', semanas: 4,  dias: [] }, activo: true },
  { id: 3, nombre: 'Tomás García',   rutina: null,                                                                                   activo: false },
  { id: 4, nombre: 'Valentina Ruiz', rutina: { id: 3, nombre: 'Kickboxing Básico',    inicio: '2025-01-10', semanas: 6,  dias: [] }, activo: true },
  { id: 5, nombre: 'Nicolás Torres', rutina: null,                                                                                   activo: true },
]

const MOCK_EJERCICIOS = [
  { id: 1, nombre: 'Sentadilla con barra' },
  { id: 2, nombre: 'Press de banca' },
  { id: 3, nombre: 'Remo con barra' },
  { id: 4, nombre: 'Curl de bíceps' },
  { id: 5, nombre: 'Salto a la soga' },
  { id: 6, nombre: 'Extensión de tríceps' },
  { id: 7, nombre: 'Bicicleta estática' },
  { id: 8, nombre: 'Estiramiento de cuádriceps' },
]

const PLANTILLAS = [
  { id: 1, nombre: 'Fuerza + Hipertrofia', dias: [] },
  { id: 2, nombre: 'Funcional Full Body',  dias: [] },
  { id: 3, nombre: 'Kickboxing Básico',    dias: [] },
]

// ─── Helpers ──────────────────────────────────────────────
function formatFecha(str) {
  if (!str) return '—'
  const d = new Date(str + 'T00:00:00')
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function nuevaSerie() {
  return { id: Date.now() + Math.random(), repeticionesSerie: 3, descanso: 60, ejercicios: [] }
}

function nuevoDia() {
  return {
    id: Date.now() + Math.random(),
    nombre: '',
    gruposMusculares: '',
    precalentamiento: nuevaSerie(),
    series: [nuevaSerie()],
    postentrenamiento: nuevaSerie(),
  }
}

function nuevoEjercicioEnSerie() {
  return { id: Date.now() + Math.random(), ejercicioId: '', repeticiones: 10, medicion: 'nada', valor: '' }
}

// ─── Subcomponentes ───────────────────────────────────────

function SerieEditor({ serie, onChange, titulo, accentColor }) {
  const updateEjerc = (eid, field, val) => {
    onChange({
      ...serie,
      ejercicios: serie.ejercicios.map(e => e.id === eid ? { ...e, [field]: val } : e)
    })
  }

  const addEjerc = () => {
    onChange({ ...serie, ejercicios: [...serie.ejercicios, nuevoEjercicioEnSerie()] })
  }

  const removeEjerc = (eid) => {
    onChange({ ...serie, ejercicios: serie.ejercicios.filter(e => e.id !== eid) })
  }

  return (
    <div className={styles.serieBox} style={{ borderColor: accentColor || 'rgba(245,197,24,0.2)' }}>
      <div className={styles.serieHeader}>
        <span className={styles.serieTitulo} style={{ color: accentColor || '#F5C518' }}>{titulo}</span>
        <div className={styles.serieMeta}>
          <label>
            <span>Series</span>
            <input
              type="number"
              min={1}
              max={20}
              value={serie.repeticionesSerie}
              onChange={e => onChange({ ...serie, repeticionesSerie: Number(e.target.value) })}
              className={styles.smallInput}
            />
          </label>
          <label>
            <span>Descanso (seg)</span>
            <input
              type="number"
              min={0}
              value={serie.descanso}
              onChange={e => onChange({ ...serie, descanso: Number(e.target.value) })}
              className={styles.smallInput}
            />
          </label>
        </div>
      </div>

      {serie.ejercicios.map((ej, idx) => (
        <div key={ej.id} className={styles.ejercicioRow}>
          <span className={styles.ejercicioNum}>{idx + 1}</span>
          <select
            value={ej.ejercicioId}
            onChange={e => updateEjerc(ej.id, 'ejercicioId', e.target.value)}
            className={styles.ejercicioSelect}
          >
            <option value="">Elegir ejercicio</option>
            {MOCK_EJERCICIOS.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.nombre}</option>
            ))}
          </select>
          <select
            value={ej.medicion}
            onChange={e => updateEjerc(ej.id, 'medicion', e.target.value)}
            className={styles.medicionSelect}
          >
            <option value="nada">Sin medición</option>
            <option value="kg">Peso (kg)</option>
            <option value="seg">Duración (seg)</option>
          </select>
          {ej.medicion !== 'nada' && (
            <input
              type="number"
              min={0}
              value={ej.valor}
              onChange={e => updateEjerc(ej.id, 'valor', e.target.value)}
              placeholder={ej.medicion === 'kg' ? 'kg' : 'seg'}
              className={styles.valorInput}
            />
          )}
          <input
            type="number"
            min={1}
            value={ej.repeticiones}
            onChange={e => updateEjerc(ej.id, 'repeticiones', Number(e.target.value))}
            placeholder="Reps"
            className={styles.repsInput}
          />
          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => removeEjerc(ej.id)}
          >✕</button>
        </div>
      ))}

      <button type="button" className={`btn btn--ghost btn--sm ${styles.addEjercBtn}`} onClick={addEjerc}>
        + Agregar ejercicio
      </button>
    </div>
  )
}

function DiaEditor({ dia, index, onChange, onRemove }) {
  const updateSerie = (sid, updated) => {
    onChange({ ...dia, series: dia.series.map(s => s.id === sid ? updated : s) })
  }

  const addSerie = () => {
    onChange({ ...dia, series: [...dia.series, nuevaSerie()] })
  }

  const removeSerie = (sid) => {
    onChange({ ...dia, series: dia.series.filter(s => s.id !== sid) })
  }

  return (
    <div className={styles.diaBox}>
      <div className={styles.diaHeader}>
        <span className={styles.diaTitulo}>DÍA {index + 1}</span>
        <button type="button" className={styles.removeDiaBtn} onClick={onRemove}>✕ Quitar día</button>
      </div>

      <div className={styles.diaFields}>
        <div className={styles.field}>
          <label>Nombre del día</label>
          <input
            type="text"
            value={dia.nombre}
            onChange={e => onChange({ ...dia, nombre: e.target.value })}
            placeholder="Ej: Piernas, Empuje, Full Body..."
          />
        </div>
        <div className={styles.field}>
          <label>Grupos musculares</label>
          <input
            type="text"
            value={dia.gruposMusculares}
            onChange={e => onChange({ ...dia, gruposMusculares: e.target.value })}
            placeholder="Ej: Cuádriceps, Glúteos, Core..."
          />
        </div>
      </div>

      <SerieEditor
        serie={dia.precalentamiento}
        onChange={updated => onChange({ ...dia, precalentamiento: updated })}
        titulo="🔥 Precalentamiento"
        accentColor="#f0a500"
      />

      <div className={styles.seriesSection}>
        <span className={styles.seriesSectionTitle}>💪 Series de trabajo</span>
        {dia.series.map((s, si) => (
          <div key={s.id} className={styles.serieWithRemove}>
            <SerieEditor
              serie={s}
              onChange={updated => updateSerie(s.id, updated)}
              titulo={`Serie ${si + 1}`}
              accentColor="#F5C518"
            />
            {dia.series.length > 1 && (
              <button type="button" className={styles.removeSerieBtn} onClick={() => removeSerie(s.id)}>
                ✕ Quitar serie
              </button>
            )}
          </div>
        ))}
        <button type="button" className="btn btn--outline btn--sm" onClick={addSerie}>
          + Agregar serie
        </button>
      </div>

      <SerieEditor
        serie={dia.postentrenamiento}
        onChange={updated => onChange({ ...dia, postentrenamiento: updated })}
        titulo="🧘 Post-entrenamiento"
        accentColor="#52c07a"
      />
    </div>
  )
}

// ─── Pasos del builder ────────────────────────────────────
const PASOS = ['Datos generales', 'Días', 'Resumen']

function StepIndicator({ pasoActual }) {
  return (
    <div className={styles.stepIndicator}>
      {PASOS.map((paso, i) => (
        <div key={paso} className={styles.stepItem}>
          <div className={`${styles.stepCircle} ${i <= pasoActual ? styles.stepActive : ''}`}>
            {i < pasoActual ? '✓' : i + 1}
          </div>
          <span className={`${styles.stepLabel} ${i <= pasoActual ? styles.stepLabelActive : ''}`}>
            {paso}
          </span>
          {i < PASOS.length - 1 && (
            <div className={`${styles.stepLine} ${i < pasoActual ? styles.stepLineActive : ''}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────
export default function ProfesorDashboard() {
  const [alumnos, setAlumnos] = useState(MOCK_ALUMNOS)
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null)
  const [builderOpen, setBuilderOpen] = useState(false)
  const [paso, setPaso] = useState(0)

  const [rutina, setRutina] = useState({
    nombre: '',
    inicio: '',
    semanas: 4,
    dias: [],
    usarPlantilla: false,
    plantillaId: '',
  })

  const abrirBuilder = (alumno, editar = false) => {
    setAlumnoSeleccionado(alumno)
    setPaso(0)
    if (editar && alumno.rutina) {
      setRutina({
        nombre:        alumno.rutina.nombre,
        inicio:        alumno.rutina.inicio,
        semanas:       alumno.rutina.semanas,
        dias:          alumno.rutina.dias.length ? alumno.rutina.dias : [nuevoDia()],
        usarPlantilla: false,
        plantillaId:   '',
      })
    } else {
      setRutina({ nombre: '', inicio: '', semanas: 4, dias: [nuevoDia()], usarPlantilla: false, plantillaId: '' })
    }
    setBuilderOpen(true)
  }

  const cerrarBuilder = () => {
    setBuilderOpen(false)
    setAlumnoSeleccionado(null)
    setPaso(0)
  }

  const handleGuardar = async () => {
    setAlumnos(prev => prev.map(a =>
      a.id === alumnoSeleccionado.id
        ? { ...a, rutina: { id: Date.now(), ...rutina } }
        : a
    ))
    cerrarBuilder()
  }

  const updateDia = (did, updated) => {
    setRutina(p => ({ ...p, dias: p.dias.map(d => d.id === did ? updated : d) }))
  }

  const removeDia = (did) => {
    setRutina(p => ({ ...p, dias: p.dias.filter(d => d.id !== did) }))
  }

  const addDia = () => {
    setRutina(p => ({ ...p, dias: [...p.dias, nuevoDia()] }))
  }

  const aplicarPlantilla = (plantillaId) => {
    const plantilla = PLANTILLAS.find(p => p.id === Number(plantillaId))
    if (plantilla) {
      setRutina(p => ({
        ...p,
        nombre:      plantilla.nombre,
        plantillaId: plantillaId,
        dias:        plantilla.dias.length ? plantilla.dias : [nuevoDia()],
      }))
    }
  }

  const puedeAvanzar = () => {
    if (paso === 0) return rutina.nombre && rutina.inicio && rutina.semanas
    if (paso === 1) return rutina.dias.length > 0
    return true
  }

  const sinRutina = alumnos.filter(a => !a.rutina && a.activo).length

  return (
    <div className={styles.page}>
      <div className="page-header">
        <h1>PANEL <span>PROFESOR</span></h1>
        <p>Seleccioná un alumno para ver o crear su rutina.</p>
      </div>

      {/* Stats rápidas */}
      <div className={styles.statsRow}>
        <div className={`card ${styles.statCard}`}>
          <span className={styles.statValue}>{alumnos.filter(a => a.activo).length}</span>
          <span className={styles.statLabel}>Alumnos activos</span>
        </div>
        <div className={`card ${styles.statCard}`}>
          <span className={`${styles.statValue} ${sinRutina > 0 ? styles.warning : ''}`}>{sinRutina}</span>
          <span className={styles.statLabel}>Sin rutina</span>
        </div>
        <div className={`card ${styles.statCard}`}>
          <span className={styles.statValue}>{alumnos.filter(a => a.rutina).length}</span>
          <span className={styles.statLabel}>Con rutina asignada</span>
        </div>
      </div>

      {/* Lista de alumnos */}
      <div className={styles.alumnosList}>
        {alumnos.map(alumno => (
          <div
            key={alumno.id}
            className={`card ${styles.alumnoCard} ${!alumno.activo ? styles.inactivo : ''}`}
          >
            <div className={styles.alumnoInfo}>
              <div className={styles.alumnoAvatar}>{alumno.nombre[0].toUpperCase()}</div>
              <div>
                <span className={styles.alumnoNombre}>{alumno.nombre}</span>
                {alumno.rutina ? (
                  <span className={styles.alumnoRutina}>📋 {alumno.rutina.nombre} · {alumno.rutina.semanas} semanas</span>
                ) : (
                  <span className={styles.alumnoSinRutina}>⚠️ Sin rutina asignada</span>
                )}
              </div>
            </div>

            <div className={styles.alumnoActions}>
              {alumno.rutina ? (
                <>
                  <span className="badge badge--success">Con rutina</span>
                  <button
                    className="btn btn--outline btn--sm"
                    onClick={() => abrirBuilder(alumno, true)}
                    disabled={!alumno.activo}
                  >
                    ✏️ Editar rutina
                  </button>
                </>
              ) : (
                <>
                  <span className="badge badge--gray">Sin rutina</span>
                  <button
                    className="btn btn--primary btn--sm"
                    onClick={() => abrirBuilder(alumno, false)}
                    disabled={!alumno.activo}
                  >
                    + Crear rutina
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── BUILDER MODAL ── */}
      <Modal
        isOpen={builderOpen}
        onClose={cerrarBuilder}
        title={`RUTINA — ${alumnoSeleccionado?.nombre?.toUpperCase() || ''}`}
        maxWidth="780px"
      >
        <div className={styles.builder}>
          <StepIndicator pasoActual={paso} />

          {/* PASO 0 — Datos generales */}
          {paso === 0 && (
            <div className={styles.paso}>
              <h3 className={styles.pasoTitulo}>Datos generales</h3>

              <div className={styles.pasoFields}>
                <div className={styles.field}>
                  <label>¿Usar plantilla?</label>
                  <select
                    value={rutina.plantillaId}
                    onChange={e => { aplicarPlantilla(e.target.value); setRutina(p => ({ ...p, usarPlantilla: !!e.target.value, plantillaId: e.target.value })) }}
                  >
                    <option value="">Crear desde cero</option>
                    {PLANTILLAS.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Nombre de la rutina</label>
                  <input
                    type="text"
                    value={rutina.nombre}
                    onChange={e => setRutina(p => ({ ...p, nombre: e.target.value }))}
                    placeholder="Ej: Fuerza + Hipertrofia — Fase 1"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label>Fecha de inicio</label>
                  <input
                    type="date"
                    value={rutina.inicio}
                    onChange={e => setRutina(p => ({ ...p, inicio: e.target.value }))}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label>Duración (semanas)</label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={rutina.semanas}
                    onChange={e => setRutina(p => ({ ...p, semanas: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 1 — Días */}
          {paso === 1 && (
            <div className={styles.paso}>
              <h3 className={styles.pasoTitulo}>Armá los días de la rutina</h3>
              <div className={styles.diasList}>
                {rutina.dias.map((dia, i) => (
                  <DiaEditor
                    key={dia.id}
                    dia={dia}
                    index={i}
                    onChange={updated => updateDia(dia.id, updated)}
                    onRemove={() => removeDia(dia.id)}
                  />
                ))}
              </div>
              <button type="button" className="btn btn--outline" onClick={addDia}>
                + Agregar día
              </button>
            </div>
          )}

          {/* PASO 2 — Resumen */}
          {paso === 2 && (
            <div className={styles.paso}>
              <h3 className={styles.pasoTitulo}>Resumen de la rutina</h3>
              <div className={`card ${styles.resumenCard}`}>
                <div className={styles.resumenItem}>
                  <span className={styles.resumenLabel}>Alumno</span>
                  <span className={styles.resumenValue}>{alumnoSeleccionado?.nombre}</span>
                </div>
                <div className={styles.resumenItem}>
                  <span className={styles.resumenLabel}>Rutina</span>
                  <span className={styles.resumenValue}>{rutina.nombre}</span>
                </div>
                <div className={styles.resumenItem}>
                  <span className={styles.resumenLabel}>Inicio</span>
                  <span className={styles.resumenValue}>{formatFecha(rutina.inicio)}</span>
                </div>
                <div className={styles.resumenItem}>
                  <span className={styles.resumenLabel}>Duración</span>
                  <span className={styles.resumenValue}>{rutina.semanas} semanas</span>
                </div>
                <div className={styles.resumenItem}>
                  <span className={styles.resumenLabel}>Días</span>
                  <span className={styles.resumenValue}>{rutina.dias.length} días</span>
                </div>
                <div className={styles.resumenDias}>
                  {rutina.dias.map((dia, i) => (
                    <div key={dia.id} className={styles.resumenDia}>
                      <span className={styles.resumenDiaTitulo}>Día {i + 1} — {dia.nombre || 'Sin nombre'}</span>
                      <span className={styles.resumenDiaSub}>
                        {dia.series.length} serie{dia.series.length !== 1 ? 's' : ''} · {dia.gruposMusculares || 'Sin grupos musculares'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navegación */}
          <div className={styles.builderNav}>
            {paso > 0 && (
              <button className="btn btn--ghost" onClick={() => setPaso(p => p - 1)}>
                ← Anterior
              </button>
            )}
            <button className="btn btn--ghost" onClick={cerrarBuilder}>Cancelar</button>
            {paso < PASOS.length - 1 ? (
              <button
                className="btn btn--primary"
                onClick={() => setPaso(p => p + 1)}
                disabled={!puedeAvanzar()}
              >
                Siguiente →
              </button>
            ) : (
              <button className="btn btn--primary" onClick={handleGuardar}>
                ✓ Guardar rutina
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}