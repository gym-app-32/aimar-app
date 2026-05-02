import { useState } from 'react'
import Modal from '../UI/Modal/Modal'
import styles from './TablaAlumnos.module.scss'
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

function InfoModal({ alumno }) {
  if (!alumno) return null
  return (
    <div className={styles.infoModal}>
      <div className={styles.infoModalHeader}>
        <Avatar nombre={alumno.nombre} size="lg" />
        <div>
          <span className={styles.infoModalNombre}>{alumno.nombre}</span>
          <span className={`badge ${alumno.activo ? 'badge--success' : 'badge--error'}`}>
            {alumno.activo ? 'Activo' : 'Bloqueado'}
          </span>
        </div>
      </div>

      <div className={styles.infoModalGrid}>
        <div className={styles.infoModalItem}>
          <span className={styles.infoModalLabel}>Email</span>
          <span className={styles.infoModalValue}>{alumno.email || '—'}</span>
        </div>
        <div className={styles.infoModalItem}>
          <span className={styles.infoModalLabel}>Teléfono</span>
          <span className={styles.infoModalValue}>{alumno.telefono || '—'}</span>
        </div>
        <div className={styles.infoModalItem}>
          <span className={styles.infoModalLabel}>Fecha de nacimiento</span>
          <span className={styles.infoModalValue}>{formatFecha(alumno.fechaNacimiento)}</span>
        </div>
        {alumno.profesor && (
          <div className={styles.infoModalItem}>
            <span className={styles.infoModalLabel}>Profesor</span>
            <span className={`badge badge--gold`}>{alumno.profesor}</span>
          </div>
        )}
        {alumno.rutina && (
          <div className={styles.infoModalItem}>
            <span className={styles.infoModalLabel}>Rutina asignada</span>
            <span className={`badge ${alumno.rutina === 'Sin asignar' ? 'badge--gray' : 'badge--success'}`}>
              {alumno.rutina}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
const EMPTY_FORM = {
  nombre: '', email: '', telefono: '', fechaNacimiento: '',
  dni: '', sexo: '', password: '',
}

// ─── Pasos del modal ──────────────────────────────────────
const PASOS = ['Datos personales', 'Actividades']

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


export default function TablaAlumnos({ alumnos = [], setAlumnos, listProfesores=[], listActividades=[]}) {
  const [infoModal, setInfoModal] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState(null)
  const [paso, setPaso] = useState(0)
  const [form, setForm] = useState(EMPTY_FORM)
  const [actividades, setActividades] = useState([]) // [{ especialidadId, profesorId }]
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  const alumnosFiltrados = alumnos.filter(a =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.dni?.includes(busqueda) ||
    a.actividades?.some(act => {
      const esp = listActividades.find(e => e.id === act.especialidadId)
      return esp?.abreviatura.toLowerCase().includes(busqueda.toLowerCase())
    })
  )

  const abrirCrear = () => {
    setEditando(null)
    setForm(EMPTY_FORM)
    setActividades([])
    setPaso(0)
    setModalOpen(true)
  }

  const abrirEditar = (alumno) => {
    setEditando(alumno)
    setForm({
      nombre: alumno.nombre,
      email: alumno.email,
      telefono: alumno.telefono,
      fechaNacimiento: alumno.fechaNacimiento,
      dni: alumno.dni || '',
      sexo: alumno.sexo || '',
      password: '',
    })
    setActividades(alumno.actividades ? [...alumno.actividades] : [])
    setPaso(0)
    setModalOpen(true)
  }

  const cerrarModal = () => {
    setModalOpen(false)
    setEditando(null)
    setForm(EMPTY_FORM)
    setActividades([])
    setPaso(0)
  }

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  // ─── Actividades handlers ─────────────────────────────
  const toggleEspecialidad = (espId) => {
    const existe = actividades.find(a => a.especialidadId === espId)
    if (existe) {
      setActividades(prev => prev.filter(a => a.especialidadId !== espId))
    } else {
      setActividades(prev => [...prev, { especialidadId: espId, profesorId: '' }])
    }
  }

  const setProfesorActividad = (espId, profesorId) => {
    setActividades(prev =>
      prev.map(a => a.especialidadId === espId ? { ...a, profesorId } : a)
    )
  }

  const profesoresPorEspecialidad = (espId) => {
    const esp = listActividades.find(e => e.id === espId)
    return listProfesores.filter(p =>
      p.especialidad === esp?.abreviatura
    )
  }

  // ─── Guardar ──────────────────────────────────────────
  const handleGuardar = async () => {
    setGuardando(true)
    await new Promise(r => setTimeout(r, 700))

    const datos = { ...form, actividades }

    if (editando) {
      setAlumnos(prev =>
        prev.map(a => a.id === editando.id ? { ...a, ...datos } : a)
      )
    } else {
      setAlumnos(prev => [...prev, {
        id: Date.now(),
        ...datos,
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

  const handleEliminar = (id) => {
    setAlumnos(prev => prev.filter(a => a.id !== id))
    setConfirmDelete(null)
  }

  const puedeAvanzar = () => {
    if (paso === 0) return form.nombre && form.email && form.dni && form.sexo
    return true
  }



  if (alumnos.length === 0) {
    return <p className={styles.empty}>No se encontraron alumnos.</p>
  }

  return (
    <>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.search}
          placeholder="Buscar por nombre, email, DNI o actividad..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <button className="btn btn--primary" onClick={abrirCrear}>
          + Nuevo alumno
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
                <th>Informacion</th>
                <th>DNI</th>
                <th>Actividades</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnosFiltrados.map(alumno => (
                <tr key={alumno.id} className={!alumno.activo ? styles.inactiveRow : ''}>
                  <td className={styles.nameCell}>
                    <Avatar nombre={alumno.nombre} />
                    <span>{alumno.nombre}</span>
                  </td>
                  <td>{alumno.email}</td>
                  <td>
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => setInfoModal(alumno)}
                      title="Ver info"
                    >
                      👁 +info
                    </button>
                  </td>
                  <td>
                    <span className={styles.dniCell}>{alumno.dni || '—'}</span>
                  </td>
                  <td>
                    <div className={styles.actividadesTags}>
                      {alumno.actividades?.length > 0
                        ? alumno.actividades.map(act => {
                          const esp = listActividades.find(e => e.id === act.especialidadId)
                          return esp ? (
                            <span key={act.especialidadId} className="badge badge--gold">
                              {esp.abreviatura}
                            </span>
                          ) : null
                        })
                        : <span className="badge badge--gray">Sin actividad</span>
                      }
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${alumno.activo ? 'badge--success' : 'badge--error'}`}>
                      {alumno.activo ? 'Activo' : 'Bloqueado'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button

                        onClick={() =>abrirEditar(alumno)}
                        title="Editar"
                      >
                        <IconEdit />
                      </button>
                      <button

                        onClick={() => toggleActivo(alumno.id)}
                        title={alumno.activo ? 'Bloquear' : 'Desbloquear'}
                      >
                        {alumno.activo ? <IconUnlocked2 /> : <IconLocked />}
                      </button>
                      {setConfirmDelete && (
                        <button

                          onClick={() => setConfirmDelete(alumno)}
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
        {alumnos.map(alumno => (
          <div
            key={alumno.id}
            className={`${styles.mobileRow} ${!alumno.activo ? styles.mobileRowInactivo : ''}`}
          >
            <Avatar nombre={alumno.nombre} />

            <div className={styles.mobileInfo}>
              <span className={styles.mobileNombre}>{alumno.nombre}</span>
              <span className={`badge ${alumno.activo ? 'badge--success' : 'badge--error'}`}>
                {alumno.activo ? 'Activo' : 'Bloqueado'}
              </span>
            </div>

            <div className={styles.mobileActions}>
              <button

                onClick={() => setInfoModal(alumno)}
                title="Ver info"
              >
                👁
              </button>
              <button

                onClick={() =>abrirEditar(alumno)}
                title="Editar"
              >
                <IconEdit />
              </button>
              <button

                onClick={() => toggleActivo(alumno.id)}
                title={alumno.activo ? 'Bloquear' : 'Desbloquear'}
              >
                {alumno.activo ? <IconUnlocked2 /> : <IconLocked />}

              </button>
              {setConfirmDelete && (
                <button

                  onClick={() => setConfirmDelete(alumno)}
                  title="Eliminar"
                >
                  <IconDelete />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal info móvil ── */}
      <Modal
        isOpen={!!infoModal}
        onClose={() => setInfoModal(null)}
        title="INFO DEL ALUMNO"
        maxWidth="420px"
      >
        <InfoModal alumno={infoModal} />
      </Modal>

      {/* ── Modal crear/editar ── */}
      <Modal
        isOpen={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'EDITAR ALUMNO' : 'NUEVO ALUMNO'}
      >
        <div className={styles.modalInner}>
          <StepIndicator pasoActual={paso} />

          {/* Paso 0 — Datos personales */}
          {paso === 0 && (
            <div className={styles.fields}>
              <div className={styles.field}>
                <label>Nombre completo *</label>
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
                <label>DNI *</label>
                <input
                  type="text"
                  name="dni"
                  value={form.dni}
                  onChange={handleChange}
                  placeholder="Ej: 35123456"
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Email *</label>
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
                <label>Sexo *</label>
                <select name="sexo" value={form.sexo} onChange={handleChange} required>
                  <option value="">Seleccioná</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="X">No binario</option>
                </select>
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
          )}

          {/* Paso 1 — Actividades */}
          {paso === 1 && (
            <div className={styles.actividadesStep}>
              <p className={styles.actividadesHint}>
                Seleccioná las actividades del alumno y asigná un profesor a cada una.
              </p>

              <div className={styles.especialidadesList}>
                {listActividades.map(esp => {
                  const seleccionada = actividades.find(a => a.especialidadId === esp.id)
                  const profDisp = profesoresPorEspecialidad(esp.id)

                  return (
                    <div
                      key={esp.id}
                      className={`${styles.especialidadItem} ${seleccionada ? styles.especialidadSeleccionada : ''}`}
                    >
                      <div className={styles.especialidadHeader}>
                        <label className={styles.especialidadCheck}>
                          <input
                            type="checkbox"
                            checked={!!seleccionada}
                            onChange={() => toggleEspecialidad(esp.id)}
                          />
                          <span className={styles.especialidadNombre}>{esp.nombre}</span>
                          <span className={styles.especialidadAbrev}>{esp.abreviatura}</span>
                        </label>
                      </div>

                      {seleccionada && (
                        <div className={styles.profesorSelector}>
                          <label>Profesor asignado</label>
                          <select
                            value={seleccionada.profesorId}
                            onChange={e => setProfesorActividad(esp.id, Number(e.target.value))}
                          >
                            <option value="">Sin asignar</option>
                            {profDisp.length > 0
                              ? profDisp.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                              ))
                              : listProfesores.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                              ))
                            }
                          </select>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Navegación */}
          <div className={styles.modalNav}>
            {paso > 0 && (
              <button className="btn btn--ghost" onClick={() => setPaso(p => p - 1)}>
                ← Anterior
              </button>
            )}
            <button className="btn btn--ghost" onClick={cerrarModal}>
              Cancelar
            </button>
            {paso < PASOS.length - 1 ? (
              <button
                className="btn btn--primary"
                onClick={() => setPaso(p => p + 1)}
                disabled={!puedeAvanzar()}
              >
                Siguiente →
              </button>
            ) : (
              <button
                className="btn btn--primary"
                onClick={handleGuardar}
                disabled={guardando}
              >
                {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear alumno'}
              </button>
            )}
          </div>
        </div>
      </Modal>

      {/* ── Modal confirmar eliminación ── */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="ELIMINAR ALUMNO"
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