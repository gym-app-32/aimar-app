import { useState } from 'react'
import { IconDelete, IconEdit } from '../Icons/Icons'
import Modal from '../UI/Modal/Modal'
import styles from './ListaActividades.module.scss'

const EMPTY_FORM_ESP = { nombre: '', abreviatura: '', descripcion: '' }


export default function ListaActividades({ especialidades, setEspecialidades }) {
  const [modalOpen, setModalOpen] = useState(false)
    const [editando, setEditando] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM_ESP)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [guardando, setGuardando] = useState(false)
    const abrirCrear = () => {
      setEditando(null)
      setForm(EMPTY_FORM_ESP)
      setModalOpen(true)
    }
  
    const abrirEditar = (esp) => {
      setEditando(esp)
      setForm({ nombre: esp.nombre, abreviatura: esp.abreviatura, descripcion: esp.descripcion })
      setModalOpen(true)
    }
  
    const cerrarModal = () => {
      setModalOpen(false)
      setEditando(null)
      setForm(EMPTY_FORM_ESP)
    }
  
    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  
    const handleGuardar = async (e) => {
      e.preventDefault()
      setGuardando(true)
      await new Promise(r => setTimeout(r, 600))
      if (editando) {
        setEspecialidades(prev => prev.map(e => e.id === editando.id ? { ...e, ...form } : e))
      } else {
        setEspecialidades(prev => [...prev, { id: Date.now(), ...form }])
      }
      setGuardando(false)
      cerrarModal()
    }
  
    const handleEliminar = (id) => {
      setEspecialidades(prev => prev.filter(e => e.id !== id))
      setConfirmDelete(null)
    }

  return (
    <>
      <div className={styles.toolbar}>
        <span className={styles.espCount}>{especialidades.length} especialidades registradas</span>
        <button className="btn btn--primary" onClick={abrirCrear}>
          + Nueva especialidad
        </button>
      </div>

      <div className={styles.espLista}>
        {especialidades.map(esp => (
          <div key={esp.id} className={`card ${styles.espCard}`}>
            <div className={styles.espInfo}>
              <div className={styles.espTitulos}>
                <span className={styles.espNombre}>{esp.nombre}</span>
                <span className={styles.espAbreviatura}>{esp.abreviatura}</span>
              </div>
              <span className={styles.espDesc}>{esp.descripcion}</span>
            </div>
            <div className={styles.actions}>
              <button onClick={() => abrirEditar(esp)}>
                <IconEdit />
              </button>
              <button onClick={() => setConfirmDelete(esp)}>
                <IconDelete />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal crear/editar */}
      <Modal
        isOpen={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'EDITAR ESPECIALIDAD' : 'NUEVA ESPECIALIDAD'}
        maxWidth="460px"
      >
        <form onSubmit={handleGuardar} className={styles.modalForm}>
          <div className={styles.fields}>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Abreviatura</label>
              <input
                type="text"
                name="abreviatura"
                value={form.abreviatura}
                onChange={handleChange}
                placeholder="Ej: Funcional, Kickboxing..."
                required
              />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Nombre</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Musculación" required />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Descripción</label>
              <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Breve descripción..." rows={3} />
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className="btn btn--ghost" onClick={cerrarModal}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={guardando}>
              {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear especialidad'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal confirmar eliminación */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="ELIMINAR ESPECIALIDAD"
        maxWidth="420px"
      >
        <div className={styles.confirmBody}>
          <p>¿Estás seguro que querés eliminar <strong>{confirmDelete?.nombre}</strong>?</p>
          <p className={styles.confirmWarning}>Esta acción no se puede deshacer.</p>
        </div>
        <div className={styles.modalFooter}>
          <button className="btn btn--ghost" onClick={() => setConfirmDelete(null)}>Cancelar</button>
          <button className="btn btn--danger" onClick={() => handleEliminar(confirmDelete.id)}>Sí, eliminar</button>
        </div>
      </Modal>
      
    </>
  )
}
