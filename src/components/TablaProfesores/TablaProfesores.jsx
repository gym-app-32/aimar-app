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

export default function TablaProfesores({
  profesores = [],
  onEditar,
  onToggleActivo,
  onEliminar,
}) {
  const [infoModal, setInfoModal] = useState(null)

  if (profesores.length === 0) {
    return <p className={styles.empty}>No se encontraron profesores.</p>
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
                <th>Especialidad</th>
                <th>Info</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {profesores.map(profesor => (
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
                        onClick={() => onEditar(profesor)}
                        title="Editar"
                      >
                        <IconEdit />
                      </button>
                      <button
                        onClick={() => onToggleActivo(profesor.id)}
                        title={profesor.activo ? 'Bloquear' : 'Desbloquear'}
                      >
                        {profesor.activo ? <IconUnlocked2 /> : <IconLocked />}
                      </button>
                      {onEliminar && (
                        <button
                          onClick={() => onEliminar(profesor)}
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
                onClick={() => onEditar(profesor)}
                title="Editar"
              >
                <IconEdit />
              </button>
              <button
                onClick={() => onToggleActivo(profesor.id)}
                title={profesor.activo ? 'Bloquear' : 'Desbloquear'}
              >
                {profesor.activo ? <IconUnlocked2 /> : <IconLocked />}
              </button>
              {onEliminar && (
                <button
                  onClick={() => onEliminar(profesor)}
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
    </>
  )
}