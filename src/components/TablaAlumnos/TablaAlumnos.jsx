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

export default function TablaAlumnos({
  alumnos = [],
  onEditar,
  onToggleActivo,
  onEliminar,        // opcional — si no se pasa no muestra el botón
  columnas = [],     // columnas extra a mostrar en desktop
}) {
  const [infoModal, setInfoModal] = useState(null)

  if (alumnos.length === 0) {
    return <p className={styles.empty}>No se encontraron alumnos.</p>
  }

  return (
    <>
      {/* ── Tabla desktop ── */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Informacion</th>
                {columnas.map(col => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map(alumno => (
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
                  {columnas.map(col => (
                    <td key={col.key}>{col.render(alumno)}</td>
                  ))}
                  <td>
                    <span className={`badge ${alumno.activo ? 'badge--success' : 'badge--error'}`}>
                      {alumno.activo ? 'Activo' : 'Bloqueado'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        
                        onClick={() => onEditar(alumno)}
                        title="Editar"
                      >
                        <IconEdit />
                      </button>
                      <button
                        
                        onClick={() => onToggleActivo(alumno.id)}
                        title={alumno.activo ? 'Bloquear' : 'Desbloquear'}
                      >
                        {alumno.activo ? <IconUnlocked2 /> : <IconLocked />}
                      </button>
                      {onEliminar && (
                        <button
                          
                          onClick={() => onEliminar(alumno)}
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
                
                onClick={() => onEditar(alumno)}
                title="Editar"
              >
                <IconEdit />
              </button>
              <button
                
                onClick={() => onToggleActivo(alumno.id)}
                title={alumno.activo ? 'Bloquear' : 'Desbloquear'}
              >
                {alumno.activo ? <IconUnlocked2 /> : <IconLocked />}

              </button>
              {onEliminar && (
                <button
                  
                  onClick={() => onEliminar(alumno)}
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
    </>
  )
}