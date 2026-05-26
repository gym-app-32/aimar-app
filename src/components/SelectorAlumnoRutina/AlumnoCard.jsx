import styles from './AlumnoCard.module.scss'

function formatFecha(str) {
  if (!str) return '—'
  return new Date(str + 'T00:00:00').toLocaleDateString('es-AR', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export default function AlumnoCard({ alumno, onCrearRutina, onEditarRutina, onEliminarRutina }) {
  return (
    <div className={`card ${styles.alumnoCard}`}>
      <div className={styles.alumnoCardHeader}>
        <div className={styles.alumnoInfo}>
          <div className={styles.alumnoAvatar}>
            {alumno.nombre[0].toUpperCase()}
          </div>
          <div>
            <span className={styles.alumnoNombre}>{alumno.nombre}</span>
            <span className={`badge ${alumno.activo ? 'badge--success' : 'badge--error'}`}>
              {alumno.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </div>

      {alumno.rutina
        ? <div className={styles.rutinaInfo}>
            <div className={styles.rutinaInfoGrid}>
              <div className={styles.rutinaInfoItem}>
                <span className={styles.rutinaInfoLabel}>Rutina actual</span>
                <span className={styles.rutinaInfoValue}>{alumno.rutina.nombre}</span>
              </div>
              <div className={styles.rutinaInfoItem}>
                <span className={styles.rutinaInfoLabel}>Inicio</span>
                <span className={styles.rutinaInfoValue}>{formatFecha(alumno.rutina.inicio)}</span>
              </div>
              <div className={styles.rutinaInfoItem}>
                <span className={styles.rutinaInfoLabel}>Duración</span>
                <span className={styles.rutinaInfoValue}>{alumno.rutina.semanas} semanas</span>
              </div>
              <div className={styles.rutinaInfoItem}>
                <span className={styles.rutinaInfoLabel}>Días</span>
                <span className={styles.rutinaInfoValue}>{alumno.rutina.dias.length || '—'}</span>
              </div>
            </div>
            <div className={styles.rutinaAcciones}>
              <button
                className="btn btn--outline"
                onClick={onEditarRutina}
                disabled={!alumno.activo}
              >
                ✏️ Editar rutina
              </button>
              <button className="btn btn--ghost" onClick={onEliminarRutina}>
                🗑️ Eliminar rutina
              </button>
            </div>
          </div>
        : <div className={styles.sinRutina}>
            <span className={styles.sinRutinaMsg}>⚠️ Este alumno no tiene rutina asignada.</span>
            <button
              className="btn btn--primary"
              onClick={onCrearRutina}
              disabled={!alumno.activo}
            >
              + Crear rutina
            </button>
          </div>
      }
    </div>
  )
}