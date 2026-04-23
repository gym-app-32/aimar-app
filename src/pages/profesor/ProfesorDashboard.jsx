import { useState, useMemo } from 'react'
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

function nuevoEjercicioEnSerie(cantReps) {
  return {
    id: Date.now() + Math.random(),
    ejercicioId: '',
    // un campo de reps por cada repetición de la serie
    reps: Array(cantReps).fill(''),
  }
}

// ─── SerieEditor ─────────────────────────────────────────
function SerieEditor({ serie, onChange, titulo, accentColor }) {

  const updateCantSeries = (val) => {
    const n = Math.max(1, Number(val))
    // Ajusta los campos de reps de cada ejercicio al nuevo número
    const ejerciciosActualizados = serie.ejercicios.map(ej => {
      const reps = Array(n).fill('').map((_, i) => ej.reps[i] ?? '')
      return { ...ej, reps }
    })
    onChange({ ...serie, repeticionesSerie: n, ejercicios: ejerciciosActualizados })
  }

  const updateRep = (eid, idx, val) => {
    onChange({
      ...serie,
      ejercicios: serie.ejercicios.map(e =>
        e.id === eid
          ? { ...e, reps: e.reps.map((r, i) => i === idx ? val : r) }
          : e
      )
    })
  }

  const updateEjercicioId = (eid, ejercicioId) => {
    onChange({
      ...serie,
      ejercicios: serie.ejercicios.map(e =>
        e.id === eid ? { ...e, ejercicioId } : e
      )
    })
  }

  const addEjerc = () => {
    onChange({
      ...serie,
      ejercicios: [...serie.ejercicios, nuevoEjercicioEnSerie(serie.repeticionesSerie)]
    })
  }

  const removeEjerc = (eid) => {
    onChange({ ...serie, ejercicios: serie.ejercicios.filter(e => e.id !== eid) })
  }

  return (
    <div className={styles.serieBox} style={{ borderColor: accentColor || 'rgba(245,197,24,0.2)' }}>
      <div className={styles.serieHeader}>
        <span className={styles.serieTitulo} style={{ color: accentColor || '#F5C518' }}>
          {titulo}
        </span>
        <div className={styles.serieMeta}>
          <label>
            <span>Cant. series</span>
            <input
              type="number"
              min={1}
              max={20}
              value={serie.repeticionesSerie}
              onChange={e => updateCantSeries(e.target.value)}
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
        <div key={ej.id} className={styles.ejercicioBlock}>
          <div className={styles.ejercicioRowTop}>
            <span className={styles.ejercicioNum}>{idx + 1}</span>
            <select
              value={ej.ejercicioId}
              onChange={e => updateEjercicioId(ej.id, e.target.value)}
              className={styles.ejercicioSelect}
            >
              <option value="">Elegir ejercicio</option>
              {MOCK_EJERCICIOS.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.nombre}</option>
              ))}
            </select>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => removeEjerc(ej.id)}
            >✕</button>
          </div>

          {/* Campos de reps dinámicos — uno por cada serie */}
          {ej.reps.length > 0 && (
            <div className={styles.repsRow}>
              {ej.reps.map((rep, i) => (
                <label key={i} className={styles.repLabel}>
                  <span>S{i + 1}</span>
                  <input
                    type="number"
                    min={0}
                    value={rep}
                    onChange={e => updateRep(ej.id, i, e.target.value)}
                    placeholder="reps"
                    className={styles.repInput}
                  />
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        className={`btn btn--ghost btn--sm ${styles.addEjercBtn}`}
        onClick={addEjerc}
      >
        + Agregar ejercicio
      </button>
    </div>
  )
}

// ─── DiaEditor ────────────────────────────────────────────
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
        <button type="button" className={styles.removeDiaBtn} onClick={onRemove}>
          ✕ Quitar día
        </button>
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
              <button
                type="button"
                className={styles.removeSerieBtn}
                onClick={() => removeSerie(s.id)}
              >
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

// ─── StepIndicator ────────────────────────────────────────
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

  // Selector con buscador
  const [busqueda, setBusqueda] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null)

  // Builder
  const [builderOpen, setBuilderOpen] = useState(false)
  const [confirmEliminar, setConfirmEliminar] = useState(false)
  const [paso, setPaso] = useState(0)
  const [rutina, setRutina] = useState({
    nombre: '', inicio: '', semanas: 4, dias: [], plantillaId: '',
  })

  // Alumnos filtrados para el dropdown
  const alumnosFiltrados = useMemo(() =>
    alumnos.filter(a =>
      a.nombre.toLowerCase().includes(busqueda.toLowerCase())
    ), [alumnos, busqueda])

  const seleccionarAlumno = (alumno) => {
    setAlumnoSeleccionado(alumno)
    setBusqueda(alumno.nombre)
    setDropdownOpen(false)
  }

  // Builder
  const abrirBuilder = (editar = false) => {
    setPaso(0)
    if (editar && alumnoSeleccionado?.rutina) {
      const r = alumnoSeleccionado.rutina
      setRutina({
        nombre:      r.nombre,
        inicio:      r.inicio,
        semanas:     r.semanas,
        dias:        r.dias.length ? r.dias : [nuevoDia()],
        plantillaId: '',
      })
    } else {
      setRutina({ nombre: '', inicio: '', semanas: 4, dias: [nuevoDia()], plantillaId: '' })
    }
    setBuilderOpen(true)
  }

  const cerrarBuilder = () => {
    setBuilderOpen(false)
    setPaso(0)
  }

  const handleGuardar = () => {
    setAlumnos(prev => prev.map(a =>
      a.id === alumnoSeleccionado.id
        ? { ...a, rutina: { id: a.rutina?.id || Date.now(), ...rutina } }
        : a
    ))
    setAlumnoSeleccionado(prev => ({ ...prev, rutina: { id: prev.rutina?.id || Date.now(), ...rutina } }))
    cerrarBuilder()
  }

  const handleEliminarRutina = () => {
    setAlumnos(prev => prev.map(a =>
      a.id === alumnoSeleccionado.id ? { ...a, rutina: null } : a
    ))
    setAlumnoSeleccionado(prev => ({ ...prev, rutina: null }))
    setConfirmEliminar(false)
  }

  const updateDia = (did, updated) => {
    setRutina(p => ({ ...p, dias: p.dias.map(d => d.id === did ? updated : d) }))
  }

  const removeDia = (did) => {
    setRutina(p => ({ ...p, dias: p.dias.filter(d => d.id !== did) }))
  }

  const aplicarPlantilla = (plantillaId) => {
    const plantilla = PLANTILLAS.find(p => p.id === Number(plantillaId))
    if (plantilla) {
      setRutina(p => ({
        ...p,
        nombre:      plantilla.nombre,
        plantillaId,
        dias:        plantilla.dias.length ? plantilla.dias : [nuevoDia()],
      }))
    }
  }

  const puedeAvanzar = () => {
    if (paso === 0) return rutina.nombre && rutina.inicio && rutina.semanas
    if (paso === 1) return rutina.dias.length > 0
    return true
  }

  return (
    <div className={styles.page}>
      <div className="page-header">
        <h1>PANEL <span>PROFESOR</span></h1>
        <p>Buscá un alumno para ver o gestionar su rutina.</p>
      </div>

      {/* ── Selector con buscador ── */}
      <div className={styles.selectorSection}>
        <label className={styles.selectorLabel}>Seleccionar alumno</label>
        <div className={styles.selectorWrapper}>
          <input
            type="text"
            className={styles.selectorInput}
            placeholder="Buscar alumno por nombre..."
            value={busqueda}
            onChange={e => {
              setBusqueda(e.target.value)
              setDropdownOpen(true)
              if (!e.target.value) setAlumnoSeleccionado(null)
            }}
            onFocus={() => setDropdownOpen(true)}
          />
          {dropdownOpen && busqueda && (
            <div className={styles.dropdown}>
              {alumnosFiltrados.length === 0 ? (
                <div className={styles.dropdownEmpty}>No se encontraron alumnos</div>
              ) : (
                alumnosFiltrados.map(a => (
                  <div
                    key={a.id}
                    className={`${styles.dropdownItem} ${!a.activo ? styles.dropdownInactivo : ''}`}
                    onClick={() => seleccionarAlumno(a)}
                  >
                    <div className={styles.dropdownAvatar}>{a.nombre[0].toUpperCase()}</div>
                    <div>
                      <span className={styles.dropdownNombre}>{a.nombre}</span>
                      <span className={styles.dropdownSub}>
                        {a.activo ? (a.rutina ? `📋 ${a.rutina.nombre}` : '⚠️ Sin rutina') : '🔒 Inactivo'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Card del alumno seleccionado ── */}
      {alumnoSeleccionado && (
        <div className={`card ${styles.alumnoCard}`}>
          <div className={styles.alumnoCardHeader}>
            <div className={styles.alumnoInfo}>
              <div className={styles.alumnoAvatar}>
                {alumnoSeleccionado.nombre[0].toUpperCase()}
              </div>
              <div>
                <span className={styles.alumnoNombre}>{alumnoSeleccionado.nombre}</span>
                <span className={`badge ${alumnoSeleccionado.activo ? 'badge--success' : 'badge--error'}`}>
                  {alumnoSeleccionado.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>

          {alumnoSeleccionado.rutina ? (
            <div className={styles.rutinaInfo}>
              <div className={styles.rutinaInfoGrid}>
                <div className={styles.rutinaInfoItem}>
                  <span className={styles.rutinaInfoLabel}>Rutina actual</span>
                  <span className={styles.rutinaInfoValue}>{alumnoSeleccionado.rutina.nombre}</span>
                </div>
                <div className={styles.rutinaInfoItem}>
                  <span className={styles.rutinaInfoLabel}>Inicio</span>
                  <span className={styles.rutinaInfoValue}>{formatFecha(alumnoSeleccionado.rutina.inicio)}</span>
                </div>
                <div className={styles.rutinaInfoItem}>
                  <span className={styles.rutinaInfoLabel}>Duración</span>
                  <span className={styles.rutinaInfoValue}>{alumnoSeleccionado.rutina.semanas} semanas</span>
                </div>
                <div className={styles.rutinaInfoItem}>
                  <span className={styles.rutinaInfoLabel}>Días</span>
                  <span className={styles.rutinaInfoValue}>{alumnoSeleccionado.rutina.dias.length || '—'}</span>
                </div>
              </div>
              <div className={styles.rutinaAcciones}>
                <button
                  className="btn btn--outline"
                  onClick={() => abrirBuilder(true)}
                  disabled={!alumnoSeleccionado.activo}
                >
                  ✏️ Editar rutina
                </button>
                <button
                  className="btn btn--ghost"
                  onClick={() => setConfirmEliminar(true)}
                >
                  🗑️ Eliminar rutina
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.sinRutina}>
              <span className={styles.sinRutinaMsg}>⚠️ Este alumno no tiene rutina asignada.</span>
              <button
                className="btn btn--primary"
                onClick={() => abrirBuilder(false)}
                disabled={!alumnoSeleccionado.activo}
              >
                + Crear rutina
              </button>
            </div>
          )}
        </div>
      )}

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
                    onChange={e => aplicarPlantilla(e.target.value)}
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
              <button type="button" className="btn btn--outline" onClick={() => setRutina(p => ({ ...p, dias: [...p.dias, nuevoDia()] }))}>
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
                  <span className={styles.resumenValue}>{rutina.dias.length}</span>
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
              <button className="btn btn--ghost" onClick={() => setPaso(p => p - 1)}>← Anterior</button>
            )}
            <button className="btn btn--ghost" onClick={cerrarBuilder}>Cancelar</button>
            {paso < PASOS.length - 1 ? (
              <button className="btn btn--primary" onClick={() => setPaso(p => p + 1)} disabled={!puedeAvanzar()}>
                Siguiente →
              </button>
            ) : (
              <button className="btn btn--primary" onClick={handleGuardar}>✓ Guardar rutina</button>
            )}
          </div>
        </div>
      </Modal>

      {/* ── CONFIRMAR ELIMINAR RUTINA ── */}
      <Modal
        isOpen={confirmEliminar}
        onClose={() => setConfirmEliminar(false)}
        title="ELIMINAR RUTINA"
        maxWidth="420px"
      >
        <div className={styles.confirmBody}>
          <p>¿Estás seguro que querés eliminar la rutina de <strong>{alumnoSeleccionado?.nombre}</strong>?</p>
          <p className={styles.confirmWarning}>Esta acción no se puede deshacer.</p>
        </div>
        <div className={styles.confirmFooter}>
          <button className="btn btn--ghost" onClick={() => setConfirmEliminar(false)}>Cancelar</button>
          <button className="btn btn--danger" onClick={handleEliminarRutina}>Sí, eliminar</button>
        </div>
      </Modal>
    </div>
  )
}