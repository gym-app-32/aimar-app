import { useState } from 'react'
import Modal from '../UI/Modal/Modal'
import styles from './TablaProfesores.module.scss'
import { IconDelete, IconEdit, IconLocked, IconUnlocked2 } from '../Icons/Icons'

function formatFecha(str) {
  if (!str) return '—'
  return new Date(str + 'T00:00:00').toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

function Avatar({ nombre, size = 'md' }) {
  return (
    <div className={`${styles.avatar} ${styles[`avatar${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}>
      {nombre?.[0]?.toUpperCase() || '?'}
    </div>
  )
}

function InfoModal({ profesor }) {
  if (!profesor) return null
  const sexoLabel = { M: 'Masculino', F: 'Femenino', X: 'No binario' }

  return (
    <div className={styles.infoModal}>
      <div className={styles.infoModalHeader}>
        <Avatar nombre={profesor.nombre} size="lg" />
        <div>
          <span className={styles.infoModalNombre}>{profesor.nombre}</span>
          <span className={`badge ${profesor.activo ? 'badge--success' : 'badge--error'}`}>
            {profesor.activo ? 'Activo' : 'Bloqueado'}
          </span>
        </div>
      </div>

      <div className={styles.infoModalGrid}>
        <div className={styles.infoModalItem}>
          <span className={styles.infoModalLabel}>Email</span>
          <span className={styles.infoModalValue}>{profesor.email || '—'}</span>
        </div>
        <div className={styles.infoModalItem}>
          <span className={styles.infoModalLabel}>Teléfono</span>
          <span className={styles.infoModalValue}>{profesor.telefono || '—'}</span>
        </div>
        <div className={styles.infoModalItem}>
          <span className={styles.infoModalLabel}>DNI</span>
          <span className={styles.infoModalValue}>{profesor.dni || '—'}</span>
        </div>
        <div className={styles.infoModalItem}>
          <span className={styles.infoModalLabel}>Sexo</span>
          <span className={styles.infoModalValue}>{sexoLabel[profesor.sexo] || '—'}</span>
        </div>
        {profesor.fechaNacimiento && (
          <div className={styles.infoModalItem}>
            <span className={styles.infoModalLabel}>Fecha de nacimiento</span>
            <span className={styles.infoModalValue}>{formatFecha(profesor.fechaNacimiento)}</span>
          </div>
        )}
        {profesor.especialidad && (
          <div className={styles.infoModalItem}>
            <span className={styles.infoModalLabel}>Especialidad</span>
            <span className="badge badge--gold">{profesor.especialidad}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function ModalCrearEditar({ handleGuardar, form, handleChange, especialidades, editando, guardando, cerrarModal }) {

  return (
    <>
      <form onSubmit={handleGuardar} className={styles.modalForm}>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label>Nombre completo</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre y apellido" required />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" required />
          </div>
          <div className={styles.field}>
            <label>Teléfono</label>
            <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} placeholder="221 0000000" />
          </div>
          <div className={styles.field}>
            <label>DNI</label>
            <input
              type="text"
              name="dni"
              value={form.dni}
              onChange={handleChange}
              placeholder="Ej: 35123456"
            />
          </div>
          <div className={styles.field}>
            <label>Sexo</label>
            <select name="sexo" value={form.sexo} onChange={handleChange}>
              <option value="">Seleccioná</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="X">No binario</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Especialidad</label>
            <select name="especialidad" value={form.especialidad} onChange={handleChange} required>
              <option value="">Seleccioná una especialidad</option>
              {especialidades.map(e => (
                <option key={e.id} value={e.nombre}>{e.nombre}</option>
              ))}
            </select>
          </div>
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label>{editando ? 'Nueva contraseña (dejá vacío para no cambiar)' : 'Contraseña'}</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required={!editando} />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button type="button" className="btn btn--ghost" onClick={cerrarModal}>Cancelar</button>
          <button type="submit" className="btn btn--primary" disabled={guardando}>
            {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear profesor'}
          </button>
        </div>
      </form>

    </>
  )
}

function ModalEliminacion({ setConfirmDelete, handleEliminar, confirmDelete }) {
  return (
    <>
      <div className={styles.confirmBody}>
        <p>¿Estás seguro que querés eliminar a <strong>{confirmDelete?.nombre}</strong>?</p>
        <p className={styles.confirmWarning}>Esta acción no se puede deshacer.</p>
      </div>
      <div className={styles.modalFooter}>
        <button className="btn btn--ghost" onClick={() => setConfirmDelete(null)}>Cancelar</button>
        <button className="btn btn--danger" onClick={() => handleEliminar(confirmDelete.id)}>Sí, eliminar</button>
      </div>
    </>
  )
}


const EMPTY_FORM_PROF = { nombre: '', email: '', telefono: '', especialidad: '', dni: '', sexo: '', password: '' }

export default function TablaProfesores({ profesores, setProfesores, especialidades }) {
  const [infoModal, setInfoModal] = useState(null)

  // Eliminá el useState de profesores — ahora viene por props
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM_PROF)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  const filtrados = profesores.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.especialidad.toLowerCase().includes(busqueda.toLowerCase())
  )

  const abrirCrear = () => {
    setEditando(null)
    setForm(EMPTY_FORM_PROF)
    setModalOpen(true)
  }

  const abrirEditar = (prof) => {
    setEditando(prof)
    setForm({
      nombre: prof.nombre,
      email: prof.email,
      telefono: prof.telefono,
      especialidad: prof.especialidad,
      dni: prof.dni || '',
      sexo: prof.sexo || '',
      password: '',
    })
    setModalOpen(true)
  }

  const cerrarModal = () => {
    setModalOpen(false)
    setEditando(null)
    setForm(EMPTY_FORM_PROF)
  }

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleGuardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    await new Promise(r => setTimeout(r, 700))
    if (editando) {
      setProfesores(prev => prev.map(p => p.id === editando.id ? { ...p, ...form } : p))
    } else {
      setProfesores(prev => [...prev, { id: Date.now(), ...form, activo: true }])
    }
    setGuardando(false)
    cerrarModal()
  }

  const toggleActivo = (id) => {
    setProfesores(prev => prev.map(p => p.id === id ? { ...p, activo: !p.activo } : p))
  }

  const handleEliminar = (id) => {
    setProfesores(prev => prev.filter(p => p.id !== id))
    setConfirmDelete(null)
  }

  if (profesores.length === 0) {
    return <p className={styles.empty}>No se encontraron profesores.</p>
  }

  return (
    <>
      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.search}
          placeholder="Buscar por nombre, email o especialidad..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <button className="btn btn--primary" onClick={abrirCrear}>
          + Nuevo profesor
        </button>
      </div>
      {/* ── Tabla desktop ── */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Especialidad</th>
                <th>Info</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(profesor => (
                <tr key={profesor.id} className={!profesor.activo ? styles.inactiveRow : ''}>
                  <td className={styles.nameCell}>
                    <Avatar nombre={profesor.nombre} />
                    <span>{profesor.nombre}</span>
                  </td>
                  <td>{profesor.email}</td>
                  <td>
                    <span className="badge badge--gold">{profesor.especialidad}</span>
                  </td>
                  <td>
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => setInfoModal(profesor)}
                      title="Ver info"
                    >
                      👁 Ver info
                    </button>
                  </td>
                  <td>
                    <span className={`badge ${profesor.activo ? 'badge--success' : 'badge--error'}`}>
                      {profesor.activo ? 'Activo' : 'Bloqueado'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => abrirEditar(profesor)}
                        title="Editar"
                      >
                        <IconEdit />
                      </button>
                      <button
                        onClick={() => toggleActivo(profesor.id)}
                        title={profesor.activo ? 'Bloquear' : 'Desbloquear'}
                      >
                        {profesor.activo ? <IconUnlocked2 /> : <IconLocked />}
                      </button>
                      {setConfirmDelete && (
                        <button
                          onClick={() => setConfirmDelete(profesor)}
                          title="Eliminar"
                        >
                          <IconDelete />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Lista móvil ── */}
      <div className={styles.mobileList}>
        {profesores.map(profesor => (
          <div
            key={profesor.id}
            className={`${styles.mobileRow} ${!profesor.activo ? styles.mobileRowInactivo : ''}`}
          >
            <Avatar nombre={profesor.nombre} />

            <div className={styles.mobileInfo}>
              <span className={styles.mobileNombre}>{profesor.nombre}</span>
              <span className={`badge ${profesor.activo ? 'badge--success' : 'badge--error'}`}>
                {profesor.activo ? 'Activo' : 'Bloqueado'}
              </span>
            </div>

            <div className={styles.mobileActions}>
              <button
                className="btn btn--ghost btn--sm"
                onClick={() => setInfoModal(profesor)}
                title="Ver info"
              >
                👁
              </button>
              <button
                onClick={() => abrirEditar(profesor)}
                title="Editar"
              >
                <IconEdit />
              </button>
              <button
                onClick={() => toggleActivo(profesor.id)}
                title={profesor.activo ? 'Bloquear' : 'Desbloquear'}
              >
                {profesor.activo ? <IconUnlocked2 /> : <IconLocked />}
              </button>
              {setConfirmDelete && (
                <button
                  onClick={() => setConfirmDelete(profesor)}
                  title="Eliminar"
                >
                  <IconDelete />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal info ── */}
      <Modal
        isOpen={!!infoModal}
        onClose={() => setInfoModal(null)}
        title="INFO DEL PROFESOR"
        maxWidth="420px"
      >
        <InfoModal profesor={infoModal} />
      </Modal>

      {/* Modal crear/editar */}
      <Modal
        isOpen={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'EDITAR PROFESOR' : 'NUEVO PROFESOR'}
      >
        <ModalCrearEditar handleGuardar={handleGuardar} form={form} handleChange={handleChange} especialidades={especialidades} editando={editando} guardando={guardando} cerrarModal={cerrarModal} />
      </Modal>

      {/* Modal confirmar eliminación */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="ELIMINAR PROFESOR"
        maxWidth="420px"
      >
        <ModalEliminacion setConfirmDelete={setConfirmDelete} handleEliminar={handleEliminar} confirmDelete={confirmDelete} />
      </Modal>

    </>
  )
}