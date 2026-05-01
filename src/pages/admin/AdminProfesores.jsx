import { useState } from 'react'
import Modal from '../../components/UI/Modal/Modal'
import TablaProfesores from '../../components/TablaProfesores/TablaProfesores'
import styles from './AdminProfesores.module.scss'
import { IconDelete, IconEdit } from '../../components/Icons/Icons'

const MOCK_ESPECIALIDADES_INIT = [
  { id: 1, nombre: 'Musculación', abreviatura: 'Musculación', descripcion: 'Entrenamiento con pesas y máquinas.' },
  { id: 2, nombre: 'Entrenamiento Funcional', abreviatura: 'Funcional', descripcion: 'Entrenamiento funcional y circuitos.' },
  { id: 3, nombre: 'Boxeo', abreviatura: 'Boxeo', descripcion: 'Técnica y entrenamiento de boxeo.' },
  { id: 4, nombre: 'Kickboxing Recreativo', abreviatura: 'Kickboxing', descripcion: 'Técnica y entrenamiento de kickboxing.' },
  { id: 5, nombre: 'Judo', abreviatura: 'Judo', descripcion: 'Arte marcial y entrenamiento de judo.' },
  { id: 6, nombre: 'Masajes Deportivos', abreviatura: 'Masajes', descripcion: 'Masajes deportivos y recuperación.' },
  { id: 7, nombre: 'Entrenamiento Personalizado', abreviatura: 'Personal', descripcion: 'Plan personalizado por objetivos.' },
]

const MOCK_PROFESORES_INIT = [
  { id: 1, nombre: 'Martín Gómez', email: 'martin@aimar.com', telefono: '221 4567890', especialidad: 'Musculación', activo: true },
  { id: 2, nombre: 'Laura Fernández', email: 'laura@aimar.com', telefono: '221 5678901', especialidad: 'Funcional', activo: true },
  { id: 3, nombre: 'Diego Rojas', email: 'diego@aimar.com', telefono: '221 6789012', especialidad: 'Boxeo', activo: false },
  { id: 4, nombre: 'Carla Méndez', email: 'carla@aimar.com', telefono: '221 7890123', especialidad: 'Kickboxing', activo: true },
]

const EMPTY_FORM_PROF = { nombre: '', email: '', telefono: '', especialidad: '', password: '' }
const EMPTY_FORM_ESP = { nombre: '', abreviatura: '', descripcion: '' }

// ─── Subcomponente Profesores ─────────────────────────────
function TabProfesores({ profesores, setProfesores, especialidades }) {
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
    setForm({ nombre: prof.nombre, email: prof.email, telefono: prof.telefono, especialidad: prof.especialidad, password: '' })
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

      <TablaProfesores
        profesores={filtrados}
        onEditar={abrirEditar}
        onToggleActivo={toggleActivo}
        onEliminar={setConfirmDelete}
      />

      {/* Modal crear/editar */}
      <Modal
        isOpen={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'EDITAR PROFESOR' : 'NUEVO PROFESOR'}
      >
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
      </Modal>

      {/* Modal confirmar eliminación */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="ELIMINAR PROFESOR"
        maxWidth="420px"
      >
        <div className={styles.confirmBody}>
          <p>¿Estás seguro que querés eliminar a <strong>{confirmDelete?.nombre}</strong>?</p>
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

// ─── Subcomponente Especialidades ─────────────────────────

function TabEspecialidades({ especialidades, setEspecialidades }) {
  // Eliminá el useState de especialidades — ahora viene por props
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

function StartCard({ num, label }) {
  return (
    <div className={`card ${styles.statCard}`}>
      <span className={styles.statValue}>{num}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────
export default function AdminProfesores() {
  const [tab, setTab] = useState('profesores')
  const [profesores, setProfesores] = useState(MOCK_PROFESORES_INIT)
  const [especialidades, setEspecialidades] = useState(MOCK_ESPECIALIDADES_INIT)

  const totalActivos = profesores.filter(p => p.activo).length

  return (
    <div className={styles.page}>
      <div className="page-header">
        <h1>GESTIÓN DE <span>PROFESORES</span></h1>
        <p>Administrá profesores y especialidades del gimnasio.</p>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <StartCard num={profesores.length} label="Total profesores" />
        <StartCard num={totalActivos} label="Activos" />
        <StartCard num={especialidades.length} label="Especialidades" />
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'profesores' ? styles.tabActive : ''}`}
          onClick={() => setTab('profesores')}
        >
          👨‍🏫 Profesores
        </button>
        <button
          className={`${styles.tab} ${tab === 'especialidades' ? styles.tabActive : ''}`}
          onClick={() => setTab('especialidades')}
        >
          🏷️ Especialidades
        </button>
      </div>

      {tab === 'profesores' && <TabProfesores profesores={profesores} setProfesores={setProfesores} especialidades={especialidades} />}
      {tab === 'especialidades' && <TabEspecialidades especialidades={especialidades} setEspecialidades={setEspecialidades} />}
    </div>
  )
}