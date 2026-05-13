import { useState } from 'react'
import Modal from '../UI/Modal/Modal'
import { IconEdit, IconDelete } from '../Icons/Icons'
import styles from './ListaUtilitarios.module.scss'

const EMPTY_FORM = { nombre: '', descripcion: '', imagen: null }

function ImagePlaceholder({ imagen, nombre }) {
  if (imagen) return <img src={imagen} alt={nombre} className={styles.tableImg} />
  return <div className={styles.tableImgPlaceholder}>🏋️</div>
}

export default function ListaUtilitarios({
  utilitarios: utilitariosIniciales = [],
  puedeCrear    = true,
  puedeEditar   = true,
  puedeEliminar = true,
}) {
  const [utilitarios, setUtilitarios] = useState(utilitariosIniciales)
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

  const abrirEditar = (u) => {
    setEditando(u)
    setForm({ nombre: u.nombre, descripcion: u.descripcion, imagen: u.imagen })
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
      setUtilitarios(prev => prev.map(u => u.id === editando.id ? { ...u, ...form } : u))
    } else {
      setUtilitarios(prev => [...prev, { id: Date.now(), ...form }])
    }
    setGuardando(false)
    cerrarModal()
  }

  const handleEliminar = (id) => {
    setUtilitarios(prev => prev.filter(u => u.id !== id))
    setConfirmDel(null)
  }

  const handleImagen = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setForm(p => ({ ...p, imagen: reader.result }))
    reader.readAsDataURL(file)
  }

  const filtrados = utilitarios.filter(u =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className={styles.container}>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.search}
          placeholder="Buscar utilitario..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        {puedeCrear && (
          <button className="btn btn--primary" onClick={abrirCrear}>
            + Nuevo utilitario
          </button>
        )}
      </div>

      {/* Tabla desktop */}
      <div className={`card ${styles.tableCard}`}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Descripción</th>
                {(puedeEditar || puedeEliminar) && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={puedeEditar || puedeEliminar ? 4 : 3} className={styles.empty}>
                    No se encontraron utilitarios.
                  </td>
                </tr>
              ) : (
                filtrados.map(u => (
                  <tr key={u.id}>
                    <td><ImagePlaceholder imagen={u.imagen} nombre={u.nombre} /></td>
                    <td className={styles.utilNombre}>{u.nombre}</td>
                    <td className={styles.utilDesc}>{u.descripcion}</td>
                    {(puedeEditar || puedeEliminar) && (
                      <td>
                        <div className={styles.actions}>
                          {puedeEditar   && <button onClick={() => abrirEditar(u)}><IconEdit /></button>}
                          {puedeEliminar && <button onClick={() => setConfirmDel(u)}><IconDelete /></button>}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lista móvil */}
      <div className={styles.mobileList}>
        {filtrados.length === 0 ? (
          <p className={styles.empty}>No se encontraron utilitarios.</p>
        ) : (
          filtrados.map(u => (
            <div key={u.id} className={styles.mobileRow}>
              <div className={styles.mobileImg}>
                {u.imagen ? <img src={u.imagen} alt={u.nombre} /> : <span>🏋️</span>}
              </div>
              <div className={styles.mobileInfo}>
                <span className={styles.mobileNombre}>{u.nombre}</span>
                <span className={styles.mobileDesc}>{u.descripcion}</span>
              </div>
              {(puedeEditar || puedeEliminar) && (
                <div className={styles.mobileActions}>
                  {puedeEditar   && <button onClick={() => abrirEditar(u)}><IconEdit /></button>}
                  {puedeEliminar && <button onClick={() => setConfirmDel(u)}><IconDelete /></button>}
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
        title={editando ? 'EDITAR UTILITARIO' : 'NUEVO UTILITARIO'}
        maxWidth="460px"
      >
        <form onSubmit={handleGuardar} className={styles.modalForm}>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label>Imagen</label>
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
                placeholder="Ej: Barra olímpica"
                required
              />
            </div>
            <div className={styles.field}>
              <label>Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                placeholder="Breve descripción del utilitario..."
                rows={3}
              />
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className="btn btn--ghost" onClick={cerrarModal}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={guardando}>
              {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear utilitario'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal confirmar borrar */}
      <Modal
        isOpen={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        title="ELIMINAR UTILITARIO"
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