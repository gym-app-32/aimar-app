import { useState } from 'react'
import styles from './AdminProfesores.module.scss'

const MOCK_PROFESORES = [
  { id: 1, nombre: 'Martín Gómez',    email: 'martin@aimar.com',  telefono: '221 4567890', especialidad: 'Musculación',  activo: true },
  { id: 2, nombre: 'Laura Fernández', email: 'laura@aimar.com',   telefono: '221 5678901', especialidad: 'Funcional',    activo: true },
  { id: 3, nombre: 'Diego Rojas',     email: 'diego@aimar.com',   telefono: '221 6789012', especialidad: 'Boxeo',        activo: false },
  { id: 4, nombre: 'Carla Méndez',    email: 'carla@aimar.com',   telefono: '221 7890123', especialidad: 'Kickboxing',   activo: true },
]

const EMPTY_FORM = {
  nombre: '',
  email: '',
  telefono: '',
  especialidad: '',
  password: '',
}

export default function AdminProfesores() {
  const [profesores, setProfesores] = useState(MOCK_PROFESORES)
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState(null) // null = creando, obj = editando
  const [form, setForm] = useState(EMPTY_FORM)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  const profesoresFiltrados = profesores.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.especialidad.toLowerCase().includes(busqueda.toLowerCase())
  )

  const abrirCrear = () => {
    setEditando(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const abrirEditar = (profesor) => {
    setEditando(profesor)
    setForm({
      nombre:       profesor.nombre,
      email:        profesor.email,
      telefono:     profesor.telefono,
      especialidad: profesor.especialidad,
      password:     '',
    })
    setModalOpen(true)
  }

  const cerrarModal = () => {
    setModalOpen(false)
    setEditando(null)
    setForm(EMPTY_FORM)
  }

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    await new Promise(r => setTimeout(r, 700))

    if (editando) {
      // Editar existente
      setProfesores(prev =>
        prev.map(p => p.id === editando.id ? { ...p, ...form } : p)
      )
    } else {
      // Crear nuevo
      const nuevo = {
        id: Date.now(),
        ...form,
        activo: true,
      }
      setProfesores(prev => [...prev, nuevo])
    }

    setGuardando(false)
    cerrarModal()
  }

  const toggleActivo = (id) => {
    setProfesores(prev =>
      prev.map(p => p.id === id ? { ...p, activo: !p.activo } : p)
    )
  }

  const handleEliminar = (id) => {
    setProfesores(prev => prev.filter(p => p.id !== id))
    setConfirmDelete(null)
  }

  return (
    <div className={styles.page}>
      <div className="page-header">
        <h1>GESTIÓN DE <span>PROFESORES</span></h1>
        <p>Creá, editá y administrá los profesores del gimnasio.</p>
      </div>

      {/* Barra de acciones */}
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

      {/* Tabla */}
      <div className={`card ${styles.tableCard}`}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Especialidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {profesoresFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.empty}>
                    No se encontraron profesores.
                  </td>
                </tr>
              ) : (
                profesoresFiltrados.map(profesor => (
                  <tr key={profesor.id} className={!profesor.activo ? styles.inactiveRow : ''}>
                    <td className={styles.nameCell}>
                      <div className={styles.avatar}>
                        {profesor.nombre[0].toUpperCase()}
                      </div>
                      <span>{profesor.nombre}</span>
                    </td>
                    <td>{profesor.email}</td>
                    <td>{profesor.telefono}</td>
                    <td>
                      <span className="badge badge--gold">{profesor.especialidad}</span>
                    </td>
                    <td>
                      <span className={`badge ${profesor.activo ? 'badge--success' : 'badge--error'}`}>
                        {profesor.activo ? 'Activo' : 'Bloqueado'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className="btn btn--ghost btn--sm"
                          onClick={() => abrirEditar(profesor)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className={`btn btn--sm ${profesor.activo ? 'btn--ghost' : 'btn--ghost'}`}
                          onClick={() => toggleActivo(profesor.id)}
                          title={profesor.activo ? 'Bloquear' : 'Desbloquear'}
                        >
                          {profesor.activo ? '🔒' : '🔓'}
                        </button>
                        <button
                          className="btn btn--ghost btn--sm"
                          onClick={() => setConfirmDelete(profesor)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal crear/editar */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={cerrarModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editando ? 'EDITAR PROFESOR' : 'NUEVO PROFESOR'}</h2>
              <button className={styles.modalClose} onClick={cerrarModal}>✕</button>
            </div>

            <form onSubmit={handleGuardar} className={styles.modalForm}>
              <div className={styles.fields}>
                <div className={styles.field}>
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Nombre y apellido"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="221 0000000"
                  />
                </div>

                <div className={styles.field}>
                  <label>Especialidad</label>
                  <select
                    name="especialidad"
                    value={form.especialidad}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccioná una especialidad</option>
                    <option value="Musculación">Musculación</option>
                    <option value="Funcional">Funcional</option>
                    <option value="Boxeo">Boxeo</option>
                    <option value="Kickboxing">Kickboxing</option>
                    <option value="Judo">Judo</option>
                    <option value="Masajes">Masajes</option>
                    <option value="Entrenamiento Personalizado">Entrenamiento Personalizado</option>
                  </select>
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>{editando ? 'Nueva contraseña (dejá vacío para no cambiar)' : 'Contraseña'}</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required={!editando}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className="btn btn--ghost" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn--primary" disabled={guardando}>
                  {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear profesor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminación */}
      {confirmDelete && (
        <div className={styles.modalOverlay} onClick={() => setConfirmDelete(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>ELIMINAR PROFESOR</h2>
              <button className={styles.modalClose} onClick={() => setConfirmDelete(null)}>✕</button>
            </div>
            <div className={styles.confirmBody}>
              <p>¿Estás seguro que querés eliminar a <strong>{confirmDelete.nombre}</strong>?</p>
              <p className={styles.confirmWarning}>Esta acción no se puede deshacer.</p>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn--ghost" onClick={() => setConfirmDelete(null)}>
                Cancelar
              </button>
              <button className="btn btn--danger" onClick={() => handleEliminar(confirmDelete.id)}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}