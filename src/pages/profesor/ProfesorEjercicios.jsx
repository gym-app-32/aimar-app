import { useEffect, useState } from 'react'
import Modal from '../../components/UI/Modal/Modal'
import styles from './ProfesorEjercicios.module.scss'
import { IconEdit, IconDelete } from '../../components/Icons/Icons'
import Loader from '../../components/Loader/Loader'
// ─── Mock data ────────────────────────────────────────────
const MOCK_UTILITARIOS = [
  { id: 1, nombre: 'Barra olímpica', descripcion: 'Barra de 20kg para ejercicios compuestos.', imagen: null },
  { id: 2, nombre: 'Mancuernas', descripcion: 'Par de mancuernas ajustables de 2 a 40kg.', imagen: null },
  { id: 3, nombre: 'Soga de saltar', descripcion: 'Soga para calentamiento y cardio.', imagen: null },
  { id: 4, nombre: 'Press de banca', descripcion: 'Banco regulable para press y ejercicios de pecho.', imagen: null },
  { id: 5, nombre: 'Polea alta', descripcion: 'Máquina de polea para jalones y tríceps.', imagen: null },
  { id: 6, nombre: 'Kettlebell', descripcion: 'Pesas rusas de distintos pesos para funcional.', imagen: null },
]

const MOCK_EJERCICIOS = [
  { id: 1, nombre: 'Sentadilla con barra', descripcion: 'Ejercicio compuesto para piernas y glúteos.', video: '', utilitarios: [1, 4], imagen: null },
  { id: 2, nombre: 'Press de banca', descripcion: 'Ejercicio de empuje para pecho y tríceps.', video: '', utilitarios: [1, 4], imagen: null },
  { id: 3, nombre: 'Remo con barra', descripcion: 'Ejercicio de tirón para espalda y bíceps.', video: '', utilitarios: [1], imagen: null },
  { id: 4, nombre: 'Curl de bíceps', descripcion: 'Ejercicio de aislamiento para bíceps.', video: '', utilitarios: [2], imagen: null },
  { id: 5, nombre: 'Salto a la soga', descripcion: 'Ejercicio cardiovascular de calentamiento.', video: '', utilitarios: [3], imagen: null },
]

const EMPTY_UTILITARIO = { nombre: '', descripcion: '', imagen: null }
const EMPTY_EJERCICIO = { nombre: '', descripcion: '', video: '', utilitarios: [], imagen: null }

// ─── Componente imagen placeholder ───────────────────────
function ImagePlaceholder({ imagen, label }) {
  if (imagen) return <img src={imagen} alt={label} className={styles.cardImg} />
  return (
    <div className={styles.cardImgPlaceholder}>
      <span>🏋️</span>
    </div>
  )
}

export default function ProfesorEjercicios() {
  const [tab, setTab] = useState('ejercicios') // 'ejercicios' | 'utilitarios'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Definimos el temporizador (ejemplo: 1 segundos)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Limpieza: si el componente se desmonta antes de los 3s, 
    // cancelamos el timer para evitar errores.
    return () => clearTimeout(timer);
  }, []);



  // ─── Utilitarios state ───────────────────────────────
  const [utilitarios, setUtilitarios] = useState(MOCK_UTILITARIOS)
  const [modalUtilOpen, setModalUtilOpen] = useState(false)
  const [editandoUtil, setEditandoUtil] = useState(null)
  const [formUtil, setFormUtil] = useState(EMPTY_UTILITARIO)
  const [confirmDelUtil, setConfirmDelUtil] = useState(null)

  // ─── Ejercicios state ────────────────────────────────
  const [ejercicios, setEjercicios] = useState(MOCK_EJERCICIOS)
  const [modalEjercOpen, setModalEjercOpen] = useState(false)
  const [editandoEjerc, setEditandoEjerc] = useState(null)
  const [formEjerc, setFormEjerc] = useState(EMPTY_EJERCICIO)
  const [confirmDelEjerc, setConfirmDelEjerc] = useState(null)

  const [guardando, setGuardando] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  // ─── Utilitarios handlers ────────────────────────────
  const abrirCrearUtil = () => {
    setEditandoUtil(null)
    setFormUtil(EMPTY_UTILITARIO)
    setModalUtilOpen(true)
  }

  const abrirEditarUtil = (u) => {
    setEditandoUtil(u)
    setFormUtil({ nombre: u.nombre, descripcion: u.descripcion, imagen: u.imagen })
    setModalUtilOpen(true)
  }

  const cerrarModalUtil = () => {
    setModalUtilOpen(false)
    setEditandoUtil(null)
    setFormUtil(EMPTY_UTILITARIO)
  }

  const handleGuardarUtil = async (e) => {
    e.preventDefault()
    setGuardando(true)
    await new Promise(r => setTimeout(r, 600))
    if (editandoUtil) {
      setUtilitarios(prev => prev.map(u => u.id === editandoUtil.id ? { ...u, ...formUtil } : u))
    } else {
      setUtilitarios(prev => [...prev, { id: Date.now(), ...formUtil }])
    }
    setGuardando(false)
    cerrarModalUtil()
  }

  const handleEliminarUtil = (id) => {
    setUtilitarios(prev => prev.filter(u => u.id !== id))
    setConfirmDelUtil(null)
  }

  const handleImagenUtil = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setFormUtil(p => ({ ...p, imagen: reader.result }))
    reader.readAsDataURL(file)
  }

  // ─── Ejercicios handlers ─────────────────────────────
  const abrirCrearEjerc = () => {
    setEditandoEjerc(null)
    setFormEjerc(EMPTY_EJERCICIO)
    setModalEjercOpen(true)
  }

  const abrirEditarEjerc = (ej) => {
    setEditandoEjerc(ej)
    setFormEjerc({ nombre: ej.nombre, descripcion: ej.descripcion, video: ej.video, utilitarios: ej.utilitarios, imagen: ej.imagen })
    setModalEjercOpen(true)
  }

  const cerrarModalEjerc = () => {
    setModalEjercOpen(false)
    setEditandoEjerc(null)
    setFormEjerc(EMPTY_EJERCICIO)
  }

  const handleGuardarEjerc = async (e) => {
    e.preventDefault()
    setGuardando(true)
    await new Promise(r => setTimeout(r, 600))
    if (editandoEjerc) {
      setEjercicios(prev => prev.map(ej => ej.id === editandoEjerc.id ? { ...ej, ...formEjerc } : ej))
    } else {
      setEjercicios(prev => [...prev, { id: Date.now(), ...formEjerc }])
    }
    setGuardando(false)
    cerrarModalEjerc()
  }

  const handleEliminarEjerc = (id) => {
    setEjercicios(prev => prev.filter(ej => ej.id !== id))
    setConfirmDelEjerc(null)
  }

  const toggleUtilitarioEjerc = (id) => {
    setFormEjerc(p => ({
      ...p,
      utilitarios: p.utilitarios.includes(id)
        ? p.utilitarios.filter(u => u !== id)
        : [...p.utilitarios, id]
    }))
  }

  const handleImagenEjerc = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setFormEjerc(p => ({ ...p, imagen: reader.result }))
    reader.readAsDataURL(file)
  }

  // ─── Filtros ──────────────────────────────────────────
  const ejerciciosFiltrados = ejercicios.filter(ej =>
    ej.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    ej.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  )

  const utilitariosFiltrados = utilitarios.filter(u =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (

    <>
      {loading
        ? <Loader />
        : <div className={styles.page}>
          <div className="page-header">
            <h1>EJERCICIOS Y <span>UTILITARIOS</span></h1>
            <p>Gestioná el catálogo de ejercicios y equipamiento.</p>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'ejercicios' ? styles.active : ''}`}
              onClick={() => { setTab('ejercicios'); setBusqueda('') }}
            >
              Ejercicios <span className={styles.tabCount}>{ejercicios.length}</span>
            </button>
            <button
              className={`${styles.tab} ${tab === 'utilitarios' ? styles.active : ''}`}
              onClick={() => { setTab('utilitarios'); setBusqueda('') }}
            >
              Utilitarios <span className={styles.tabCount}>{utilitarios.length}</span>
            </button>
          </div>

          {/* Toolbar */}
          <div className={styles.toolbar}>
            <input
              type="text"
              className={styles.search}
              placeholder={tab === 'ejercicios' ? 'Buscar ejercicio...' : 'Buscar utilitario...'}
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
            <button
              className="btn btn--primary"
              onClick={tab === 'ejercicios' ? abrirCrearEjerc : abrirCrearUtil}
            >
              + {tab === 'ejercicios' ? 'Nuevo ejercicio' : 'Nuevo utilitario'}
            </button>
          </div>

          {/* ── TAB EJERCICIOS ── */}
          {tab === 'ejercicios' && (
            <div className={styles.ejerciciosGrid}>
              {ejerciciosFiltrados.length === 0 ? (
                <p className={styles.empty}>No se encontraron ejercicios.</p>
              ) : (
                ejerciciosFiltrados.map(ej => (
                  <div key={ej.id} className={`card ${styles.ejercicioCard}`}>
                    <ImagePlaceholder imagen={ej.imagen} label={ej.nombre} />
                    <div className={styles.cardBody}>
                      <h3 className={styles.cardNombre}>{ej.nombre}</h3>
                      <p className={styles.cardDesc}>{ej.descripcion}</p>
                      {ej.utilitarios.length > 0 && (
                        <div className={styles.utilitarioTags}>
                          {ej.utilitarios.map(uid => {
                            const u = utilitarios.find(u => u.id === uid)
                            return u ? (
                              <span key={uid} className="badge badge--gray">{u.nombre}</span>
                            ) : null
                          })}
                        </div>
                      )}
                      {ej.video && (
                        <a href={ej.video} target="_blank" rel="noopener noreferrer" className={styles.videoLink}>
                          ▶ Ver video
                        </a>
                      )}
                    </div>
                    <div className={styles.cardActions}>
                      <button onClick={() => abrirEditarEjerc(ej)}><IconEdit /> Editar</button>
                      <button onClick={() => setConfirmDelEjerc(ej)}><IconDelete /> Borrar</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── TAB UTILITARIOS ── */}
          {tab === 'utilitarios' && (
            <>
              {/* Tabla desktop */}
              <div className={`card ${styles.tableCard}`}>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {utilitariosFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan={4} className={styles.empty}>No se encontraron utilitarios.</td>
                        </tr>
                      ) : (
                        utilitariosFiltrados.map(u => (
                          <tr key={u.id}>
                            <td>
                              {u.imagen
                                ? <img src={u.imagen} alt={u.nombre} className={styles.tableImg} />
                                : <div className={styles.tableImgPlaceholder}>🏋️</div>
                              }
                            </td>
                            <td className={styles.utilNombre}>{u.nombre}</td>
                            <td className={styles.utilDesc}>{u.descripcion}</td>
                            <td>
                              <div className={styles.actions}>
                                <button onClick={() => abrirEditarUtil(u)}>
                                  <IconEdit />
                                </button>
                                <button onClick={() => setConfirmDelUtil(u)}>
                                  <IconDelete />
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

              {/* Lista móvil */}
              <div className={styles.utilMobileList}>
                {utilitariosFiltrados.length === 0 ? (
                  <p className={styles.empty}>No se encontraron utilitarios.</p>
                ) : (
                  utilitariosFiltrados.map(u => (
                    <div key={u.id} className={styles.utilMobileRow}>
                      <div className={styles.utilMobileImg}>
                        {u.imagen
                          ? <img src={u.imagen} alt={u.nombre} />
                          : <span>🏋️</span>
                        }
                      </div>
                      <div className={styles.utilMobileInfo}>
                        <span className={styles.utilMobileNombre}>{u.nombre}</span>
                        <span className={styles.utilMobileDesc}>{u.descripcion}</span>
                      </div>
                      <div className={styles.utilMobileActions}>
                        <button onClick={() => abrirEditarUtil(u)}>
                          <IconEdit />
                        </button>
                        <button onClick={() => setConfirmDelUtil(u)}>
                          <IconDelete />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}


          {/* ── MODAL UTILITARIO ── */}
          <Modal
            isOpen={modalUtilOpen}
            onClose={cerrarModalUtil}
            title={editandoUtil ? 'EDITAR UTILITARIO' : 'NUEVO UTILITARIO'}
            maxWidth="460px"
          >
            <form onSubmit={handleGuardarUtil} className={styles.modalForm}>
              <div className={styles.fields}>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Imagen</label>
                  <div className={styles.uploadArea}>
                    {formUtil.imagen
                      ? <img src={formUtil.imagen} alt="preview" className={styles.uploadPreview} />
                      : <span className={styles.uploadPlaceholder}>🏋️ Subir imagen</span>
                    }
                    <input type="file" accept="image/*" onChange={handleImagenUtil} className={styles.uploadInput} />
                  </div>
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={formUtil.nombre}
                    onChange={e => setFormUtil(p => ({ ...p, nombre: e.target.value }))}
                    placeholder="Ej: Barra olímpica"
                    required
                  />
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Descripción</label>
                  <textarea
                    value={formUtil.descripcion}
                    onChange={e => setFormUtil(p => ({ ...p, descripcion: e.target.value }))}
                    placeholder="Breve descripción del utilitario..."
                    rows={3}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className="btn btn--ghost" onClick={cerrarModalUtil}>Cancelar</button>
                <button type="submit" className="btn btn--primary" disabled={guardando}>
                  {guardando ? 'Guardando...' : editandoUtil ? 'Guardar cambios' : 'Crear utilitario'}
                </button>
              </div>
            </form>
          </Modal>

          {/* ── MODAL EJERCICIO ── */}
          <Modal
            isOpen={modalEjercOpen}
            onClose={cerrarModalEjerc}
            title={editandoEjerc ? 'EDITAR EJERCICIO' : 'NUEVO EJERCICIO'}
          >
            <form onSubmit={handleGuardarEjerc} className={styles.modalForm}>
              <div className={styles.fields}>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Imagen de referencia</label>
                  <div className={styles.uploadArea}>
                    {formEjerc.imagen
                      ? <img src={formEjerc.imagen} alt="preview" className={styles.uploadPreview} />
                      : <span className={styles.uploadPlaceholder}>🏋️ Subir imagen</span>
                    }
                    <input type="file" accept="image/*" onChange={handleImagenEjerc} className={styles.uploadInput} />
                  </div>
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={formEjerc.nombre}
                    onChange={e => setFormEjerc(p => ({ ...p, nombre: e.target.value }))}
                    placeholder="Ej: Sentadilla con barra"
                    required
                  />
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Descripción</label>
                  <textarea
                    value={formEjerc.descripcion}
                    onChange={e => setFormEjerc(p => ({ ...p, descripcion: e.target.value }))}
                    placeholder="Descripción del ejercicio y músculos que trabaja..."
                    rows={3}
                  />
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Video de muestra (URL)</label>
                  <input
                    type="url"
                    value={formEjerc.video}
                    onChange={e => setFormEjerc(p => ({ ...p, video: e.target.value }))}
                    placeholder="https://youtube.com/..."
                  />
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Utilitarios necesarios</label>
                  <div className={styles.utilitariosCheck}>
                    {utilitarios.map(u => (
                      <label key={u.id} className={styles.checkItem}>
                        <input
                          type="checkbox"
                          checked={formEjerc.utilitarios.includes(u.id)}
                          onChange={() => toggleUtilitarioEjerc(u.id)}
                        />
                        <span>{u.nombre}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              <div className={styles.modalFooter}>
                <button type="button" className="btn btn--ghost" onClick={cerrarModalEjerc}>Cancelar</button>
                <button type="submit" className="btn btn--primary" disabled={guardando}>
                  {guardando ? 'Guardando...' : editandoEjerc ? 'Guardar cambios' : 'Crear ejercicio'}
                </button>
              </div>
            </form>
          </Modal>

          {/* ── MODAL CONFIRMAR BORRAR UTILITARIO ── */}
          <Modal
            isOpen={!!confirmDelUtil}
            onClose={() => setConfirmDelUtil(null)}
            title="ELIMINAR UTILITARIO"
            maxWidth="420px"
          >
            <div className={styles.confirmBody}>
              <p>¿Estás seguro que querés eliminar <strong>{confirmDelUtil?.nombre}</strong>?</p>
              <p className={styles.confirmWarning}>Esta acción no se puede deshacer.</p>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn--ghost" onClick={() => setConfirmDelUtil(null)}>Cancelar</button>
              <button className="btn btn--danger" onClick={() => handleEliminarUtil(confirmDelUtil.id)}>Sí, eliminar</button>
            </div>
          </Modal>

          {/* ── MODAL CONFIRMAR BORRAR EJERCICIO ── */}
          <Modal
            isOpen={!!confirmDelEjerc}
            onClose={() => setConfirmDelEjerc(null)}
            title="ELIMINAR EJERCICIO"
            maxWidth="420px"
          >
            <div className={styles.confirmBody}>
              <p>¿Estás seguro que querés eliminar <strong>{confirmDelEjerc?.nombre}</strong>?</p>
              <p className={styles.confirmWarning}>Esta acción no se puede deshacer.</p>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn--ghost" onClick={() => setConfirmDelEjerc(null)}>Cancelar</button>
              <button className="btn btn--danger" onClick={() => handleEliminarEjerc(confirmDelEjerc.id)}>Sí, eliminar</button>
            </div>
          </Modal>
        </div>
      }
    </>
  )
}