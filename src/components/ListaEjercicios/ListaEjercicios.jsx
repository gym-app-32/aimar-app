import { useState } from 'react'
import Modal from '../UI/Modal/Modal'
import { IconEdit, IconDelete } from '../Icons/Icons'
import styles from './ListaEjercicios.module.scss'

const EMPTY_FORM = { nombre: '', descripcion: '', video: '', utilitarios: [], imagen: null }

function ImagePlaceholder({ imagen, nombre }) {
  if (imagen) return <img src={imagen} alt={nombre} className={styles.cardImg} />
  return <div className={styles.cardImgPlaceholder}><span>🏋️</span></div>
}

export default function ListaEjercicios({
  ejercicios: ejerciciosIniciales = [],
  utilitarios = [],
  puedeCrear    = true,
  puedeEditar   = true,
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
    setForm({ nombre: ej.nombre, descripcion: ej.descripcion, video: ej.video, utilitarios: ej.utilitarios, imagen: ej.imagen })
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

  const toggleUtilitario = (id) => {
    setForm(p => ({
      ...p,
      utilitarios: p.utilitarios.includes(id)
        ? p.utilitarios.filter(u => u !== id)
        : [...p.utilitarios, id]
    }))
  }

  const handleImagen = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setForm(p => ({ ...p, imagen: reader.result }))
    reader.readAsDataURL(file)
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
              <ImagePlaceholder imagen={ej.imagen} nombre={ej.nombre} />
              <div className={styles.cardBody}>
                <h3 className={styles.cardNombre}>{ej.nombre}</h3>
                <p className={styles.cardDesc}>{ej.descripcion}</p>
                {ej.utilitarios.length > 0 && (
                  <div className={styles.utilitarioTags}>
                    {ej.utilitarios.map(uid => {
                      const u = utilitarios.find(u => u.id === uid)
                      return u
                        ? <span key={uid} className="badge badge--gray">{u.nombre}</span>
                        : null
                    })}
                  </div>
                )}
                {ej.video && (
                  <a href={ej.video} target="_blank" rel="noopener noreferrer" className={styles.videoLink}>
                    ▶ Ver video
                  </a>
                )}
              </div>
              {(puedeEditar || puedeEliminar) && (
                <div className={styles.cardActions}>
                  {puedeEditar   && <button onClick={() => abrirEditar(ej)}><IconEdit /> Editar</button>}
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
            <div className={styles.field}>
              <label>Imagen de referencia</label>
              <div className={styles.uploadArea}>
                {form.imagen
                  ? <img src={form.imagen} alt="preview" className={styles.uploadPreview} />
                  : <span className={styles.uploadPlaceholder}>🏋️ Subir imagen</span>
                }
                <input type="file" accept="image/*" onChange={handleImagen} className={styles.uploadInput} />
              </div>
            </div>
            <div className={styles.field}>
              <label>Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                placeholder="Ej: Sentadilla con barra"
                required
              />
            </div>
            <div className={styles.field}>
              <label>Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                placeholder="Descripción del ejercicio y músculos que trabaja..."
                rows={3}
              />
            </div>
            <div className={styles.field}>
              <label>Video de muestra (URL)</label>
              <input
                type="url"
                value={form.video}
                onChange={e => setForm(p => ({ ...p, video: e.target.value }))}
                placeholder="https://youtube.com/..."
              />
            </div>
            {utilitarios.length > 0 && (
              <div className={styles.field}>
                <label>Utilitarios necesarios</label>
                <div className={styles.utilitariosCheck}>
                  {utilitarios.map(u => (
                    <label key={u.id} className={styles.checkItem}>
                      <input
                        type="checkbox"
                        checked={form.utilitarios.includes(u.id)}
                        onChange={() => toggleUtilitario(u.id)}
                      />
                      <span>{u.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
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