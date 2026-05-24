import { useState, useRef, useEffect } from 'react'
import Modal from '../UI/Modal/Modal'
import { IconEdit, IconDelete } from '../Icons/Icons'
import BodyMap, {
  bodyFront, bodyBack,
  bodyFemaleFront, bodyFemaleBack
} from '../UI/BodyMap/BodyMap'
import styles from './ListaEjercicios.module.scss'

// ─── Labels de músculos (mismo objeto que BodyMap) ────────
const MUSCULOS_LABEL = {
  chest: 'Pecho',
  deltoids: 'Hombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  forearm: 'Antebrazos',
  abs: 'Abdomen',
  obliques: 'Oblicuos',
  quadriceps: 'Cuádriceps',
  calves: 'Gemelos',
  trapezius: 'Trapecios',
  'upper-back': 'Espalda alta',
  'lower-back': 'Lumbar',
  gluteal: 'Glúteos',
  hamstring: 'Isquiotibiales',
  adductors: 'Aductores',
  knees: 'Rodillas',
  tibialis: 'Tibial',
  ankles: 'Tobillos',
  hands: 'Manos',
  feet: 'Pies',
  neck: 'Cuello',
}

const EMPTY_FORM = {
  nombre: '',
  descripcion: '',
  video: '',
  utilitarios: [],
  musculos: [],
}

// ─── Dropdown multiselect para utilitarios ────────────────
function DropdownUtilitarios({ utilitarios, seleccionados, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Cerrar al hacer click afuera
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggle = (id) => {
    onChange(
      seleccionados.includes(id)
        ? seleccionados.filter(u => u !== id)
        : [...seleccionados, id]
    )
  }

  const label = seleccionados.length === 0
    ? 'Seleccioná el equipamiento'
    : seleccionados.length === 1
      ? utilitarios.find(u => u.id === seleccionados[0])?.nombre
      : `${seleccionados.length} utilitarios seleccionados`

  return (
    <div className={styles.dropdown} ref={ref}>
      <button
        type="button"
        className={styles.dropdownTrigger}
        onClick={() => setOpen(o => !o)}
      >
        <span className={seleccionados.length === 0 ? styles.dropdownPlaceholder : ''}>
          {label}
        </span>
        <span className={`${styles.dropdownArrow} ${open ? styles.dropdownArrowOpen : ''}`}>▾</span>
      </button>

      {open && (
        <div className={styles.dropdownMenu}>
          {utilitarios.length === 0
            ? <p className={styles.dropdownEmpty}>No hay utilitarios cargados</p>
            : utilitarios.map(u => (
              <label key={u.id} className={styles.dropdownItem}>
                <input
                  type="checkbox"
                  checked={seleccionados.includes(u.id)}
                  onChange={() => toggle(u.id)}
                />
                <span>{u.nombre}</span>
              </label>
            ))
          }
        </div>
      )}
    </div>
  )
}

// ─── Helper embed YouTube ─────────────────────────────────
function youtubeEmbed(url) {
  try {
    const u = new URL(url)
    let id = u.searchParams.get('v')
    if (!id && u.hostname === 'youtu.be') id = u.pathname.slice(1)
    if (!id) return url
    return `https://www.youtube.com/embed/${id}`
  } catch {
    return url
  }
}

export default function ListaEjercicios({
  ejercicios: ejerciciosIniciales = [],
  utilitarios = [],
  puedeCrear = true,
  puedeEditar = true,
  puedeEliminar = true,
}) {
  const [ejercicios, setEjercicios] = useState(ejerciciosIniciales)
  const [busqueda, setBusqueda] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [confirmDel, setConfirmDel] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const abrirCrear = () => {
    setEditando(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const abrirEditar = (ej) => {
    setEditando(ej)
    setForm({
      nombre: ej.nombre,
      descripcion: ej.descripcion,
      video: ej.video ?? '',
      utilitarios: ej.utilitarios ?? [],
      musculos: ej.musculos ?? [],
    })
    setModalOpen(true)
  }

  const cerrarModal = () => {
    setModalOpen(false)
    setEditando(null)
    setForm(EMPTY_FORM)
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    await new Promise(r => setTimeout(r, 600))
    if (editando) {
      setEjercicios(prev => prev.map(ej => ej.id === editando.id ? { ...ej, ...form } : ej))
    } else {
      setEjercicios(prev => [...prev, { id: Date.now(), ...form }])
    }
    setGuardando(false)
    cerrarModal()
  }

  const handleEliminar = (id) => {
    setEjercicios(prev => prev.filter(ej => ej.id !== id))
    setConfirmDel(null)
  }

  const filtrados = ejercicios.filter(ej =>
    ej.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    ej.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className={styles.container}>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.search}
          placeholder="Buscar ejercicio..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        {puedeCrear && (
          <button className="btn btn--primary" onClick={abrirCrear}>
            + Nuevo ejercicio
          </button>
        )}
      </div>

      {/* Grid de cards */}
      <div className={styles.grid}>
        {filtrados.length === 0 ? (
          <p className={styles.empty}>No se encontraron ejercicios.</p>
        ) : (
          filtrados.map(ej => (
            <div key={ej.id} className={`card ${styles.card}`}>

              {/* Video o placeholder */}
              {ej.video
                ? <div className={styles.videoWrapper}>
                  <iframe
                    src={youtubeEmbed(ej.video)}
                    title={ej.nombre}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={styles.videoIframe}
                  />
                </div>
                : <div className={styles.cardImgPlaceholder}><span>🏋️</span></div>
              }

              <div className={styles.cardBody}>
                <h3 className={styles.cardNombre}>{ej.nombre}</h3>
                <p className={styles.cardDesc}>{ej.descripcion}</p>

                {/* Grupos musculares */}
                {ej.musculos?.length > 0 && (
                  <div className={styles.tagGroup}>
                    <span className={styles.tagGroupLabel}>Músculos</span>
                    <div className={styles.tags}>
                      {ej.musculos.map(slug => (
                        <span key={slug} className="badge badge--gold">
                          {MUSCULOS_LABEL[slug] ?? slug}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Utilitarios */}
                {ej.utilitarios?.length > 0 && (
                  <div className={styles.tagGroup}>
                    <span className={styles.tagGroupLabel}>Equipamiento</span>
                    <div className={styles.tags}>
                      {ej.utilitarios.map(uid => {
                        const u = utilitarios.find(u => u.id === uid)
                        return u
                          ? <span key={uid} className="badge badge--gray">{u.nombre}</span>
                          : null
                      })}
                    </div>
                  </div>
                )}
              </div>

              {(puedeEditar || puedeEliminar) && (
                <div className={styles.cardActions}>
                  {puedeEditar && <button onClick={() => abrirEditar(ej)}><IconEdit /> Editar</button>}
                  {puedeEliminar && <button onClick={() => setConfirmDel(ej)}><IconDelete /> Borrar</button>}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal crear / editar */}
      <Modal
        isOpen={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'EDITAR EJERCICIO' : 'NUEVO EJERCICIO'}
      >
        <form onSubmit={handleGuardar} className={styles.modalForm}>
          <div className={styles.fields}>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                placeholder="Ej: Sentadilla con barra"
                required
              />
            </div>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                placeholder="Descripción del ejercicio..."
                rows={3}
              />
            </div>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Video de muestra (URL de YouTube)</label>
              <input
                type="url"
                value={form.video}
                onChange={e => setForm(p => ({ ...p, video: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            {/* Utilitarios — dropdown */}
            {utilitarios.length > 0 && (
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Equipamiento necesario</label>
                <DropdownUtilitarios
                  utilitarios={utilitarios}
                  seleccionados={form.utilitarios}
                  onChange={(val) => setForm(p => ({ ...p, utilitarios: val }))}
                />
              </div>
            )}

            {/* Grupos musculares — BodyMap */}
            {/* Grupos musculares — BodyMap */}
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Grupos musculares trabajados</label>
              <div className={styles.bodyMapContainer}>
                <BodyMap
                  genero="male"
                  seleccionados={form.musculos}
                  onChange={(slugs) => setForm(p => ({ ...p, musculos: slugs }))}
                  bodyFront={bodyFront}
                  bodyBack={bodyBack}
                  scale={0.75}
                  border="#dfdfdf"
                  coloresFatiga={{}}
                />
              </div>
              {form.musculos.length > 0
                ? <div className={styles.musculosSeleccionados}>
                  {form.musculos.map(slug => (
                    <span key={slug} className="badge badge--gold">
                      {MUSCULOS_LABEL[slug] ?? slug}
                    </span>
                  ))}
                </div>
                : <p className={styles.fieldHint}>Tocá los músculos en la figura para seleccionarlos.</p>
              }
            </div>

          </div>

          <div className={styles.modalFooter}>
            <button type="button" className="btn btn--ghost" onClick={cerrarModal}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={guardando}>
              {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear ejercicio'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal confirmar borrar */}
      <Modal
        isOpen={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        title="ELIMINAR EJERCICIO"
        maxWidth="420px"
      >
        <div className={styles.confirmBody}>
          <p>¿Estás seguro que querés eliminar <strong>{confirmDel?.nombre}</strong>?</p>
          <p className={styles.confirmWarning}>Esta acción no se puede deshacer.</p>
        </div>
        <div className={styles.modalFooter}>
          <button className="btn btn--ghost" onClick={() => setConfirmDel(null)}>Cancelar</button>
          <button className="btn btn--danger" onClick={() => handleEliminar(confirmDel.id)}>Sí, eliminar</button>
        </div>
      </Modal>
    </div>
  )
}