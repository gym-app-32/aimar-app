import { useState } from 'react'
import Modal from '../../components/UI/Modal/Modal'
import styles from './ProfesorAlumnos.module.scss'

const MOCK_PROFESORES = [
  { id: 1, nombre: 'Martín Gómez' },
  { id: 2, nombre: 'Laura Fernández' },
  { id: 3, nombre: 'Diego Rojas' },
  { id: 4, nombre: 'Carla Méndez' },
]

const MOCK_ALUMNOS = [
  { id: 1, nombre: 'Carlos Pérez',    email: 'carlos@gmail.com',  telefono: '221 1234567', fechaNacimiento: '1995-06-15', profesor: 'Martín Gómez',    rutina: 'Fuerza + Hipertrofia', activo: true },
  { id: 2, nombre: 'Sofía López',     email: 'sofia@gmail.com',   telefono: '221 2345678', fechaNacimiento: '1998-03-22', profesor: 'Laura Fernández', rutina: 'Funcional Full Body',  activo: true },
  { id: 3, nombre: 'Tomás García',    email: 'tomas@gmail.com',   telefono: '221 3456789', fechaNacimiento: '2000-11-08', profesor: 'Martín Gómez',    rutina: 'Sin asignar',          activo: false },
  { id: 4, nombre: 'Valentina Ruiz',  email: 'vale@gmail.com',    telefono: '221 4567890', fechaNacimiento: '1993-07-30', profesor: 'Carla Méndez',    rutina: 'Kickboxing Básico',    activo: true },
  { id: 5, nombre: 'Nicolás Torres',  email: 'nico@gmail.com',    telefono: '221 5678901', fechaNacimiento: '1997-01-14', profesor: 'Laura Fernández', rutina: 'Sin asignar',          activo: true },
]

const EMPTY_FORM = {
  nombre: '',
  email: '',
  telefono: '',
  fechaNacimiento: '',
  profesor: '',
  password: '',
}

export default function ProfesorAlumnos() {
  const [alumnos, setAlumnos] = useState(MOCK_ALUMNOS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [guardando, setGuardando] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  const alumnosFiltrados = alumnos.filter(a =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.profesor.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.rutina.toLowerCase().includes(busqueda.toLowerCase())
  )

  const abrirCrear = () => {
    setEditando(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const abrirEditar = (alumno) => {
    setEditando(alumno)
    setForm({
      nombre:          alumno.nombre,
      email:           alumno.email,
      telefono:        alumno.telefono,
      fechaNacimiento: alumno.fechaNacimiento,
      profesor:        alumno.profesor,
      password:        '',
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
      setAlumnos(prev =>
        prev.map(a => a.id === editando.id ? { ...a, ...form } : a)
      )
    } else {
      setAlumnos(prev => [...prev, {
        id: Date.now(),
        ...form,
        rutina: 'Sin asignar',
        activo: true,
      }])
    }

    setGuardando(false)
    cerrarModal()
  }

  const toggleActivo = (id) => {
    setAlumnos(prev =>
      prev.map(a => a.id === id ? { ...a, activo: !a.activo } : a)
    )
  }

  const totalActivos = alumnos.filter(a => a.activo).length
  const sinRutina = alumnos.filter(a => a.rutina === 'Sin asignar').length

  return (
    <div className={styles.page}>
      <div className="page-header">
        <h1>MIS <span>ALUMNOS</span></h1>
        <p>Gestioná y seguí el progreso de tus alumnos.</p>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={`card ${styles.statCard}`}>
          <span className={styles.statValue}>{alumnos.length}</span>
          <span className={styles.statLabel}>Total alumnos</span>
        </div>
        <div className={`card ${styles.statCard}`}>
          <span className={styles.statValue}>{totalActivos}</span>
          <span className={styles.statLabel}>Activos</span>
        </div>
        <div className={`card ${styles.statCard}`}>
          <span className={`${styles.statValue} ${sinRutina > 0 ? styles.warning : ''}`}>
            {sinRutina}
          </span>
          <span className={styles.statLabel}>Sin rutina</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.search}
          placeholder="Buscar por nombre, email, profesor o rutina..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <button className="btn btn--primary" onClick={abrirCrear}>
          + Nuevo alumno
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
                <th>Profesor</th>
                <th>Rutina</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.empty}>
                    No se encontraron alumnos.
                  </td>
                </tr>
              ) : (
                alumnosFiltrados.map(alumno => (
                  <tr key={alumno.id} className={!alumno.activo ? styles.inactiveRow : ''}>
                    <td className={styles.nameCell}>
                      <div className={styles.avatar}>
                        {alumno.nombre[0].toUpperCase()}
                      </div>
                      <span>{alumno.nombre}</span>
                    </td>
                    <td>{alumno.email}</td>
                    <td>{alumno.telefono}</td>
                    <td>
                      <span className="badge badge--gold">{alumno.profesor || '—'}</span>
                    </td>
                    <td>
                      <span className={`badge ${alumno.rutina === 'Sin asignar' ? 'badge--gray' : 'badge--success'}`}>
                        {alumno.rutina}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${alumno.activo ? 'badge--success' : 'badge--error'}`}>
                        {alumno.activo ? 'Activo' : 'Bloqueado'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className="btn btn--ghost btn--sm"
                          onClick={() => abrirEditar(alumno)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn--ghost btn--sm"
                          onClick={() => toggleActivo(alumno.id)}
                          title={alumno.activo ? 'Bloquear' : 'Desbloquear'}
                        >
                          {alumno.activo ? '🔒' : '🔓'}
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
      <Modal
        isOpen={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'EDITAR ALUMNO' : 'NUEVO ALUMNO'}
      >
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
              <label>Fecha de nacimiento</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={form.fechaNacimiento}
                onChange={handleChange}
              />
            </div>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Profesor asignado</label>
              <select
                name="profesor"
                value={form.profesor}
                onChange={handleChange}
              >
                <option value="">Sin asignar</option>
                {MOCK_PROFESORES.map(p => (
                  <option key={p.id} value={p.nombre}>{p.nombre}</option>
                ))}
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
              {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear alumno'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}