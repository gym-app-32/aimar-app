import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './AdminDashboard.module.scss'
import { IconAlumnanos, IconEjercicios, IconsProfesores } from '../../components/Icons/Icons'
import Loader from '../../components/Loader/Loader'


const MOCK_STATS = {
  alumnosActivos: 35,
  entrenamientosSemana: 127,
  profesoresActivos: 6,
}

const MOCK_SIN_RUTINA = [
  { id: 3, nombre: 'Tomás García', profesor: 'Martín Gómez' },
  { id: 5, nombre: 'Nicolás Torres', profesor: 'Laura Fernández' },
  { id: 9, nombre: 'Agustín Vera', profesor: 'Sin asignar' },
]

const MOCK_SIN_ENTRENAR = [
  { id: 7, nombre: 'Romina Castillo', diasSinEntrenar: 12, profesor: 'Carla Méndez' },
  { id: 11, nombre: 'Pablo Herrera', diasSinEntrenar: 9, profesor: 'Martín Gómez' },
  { id: 14, nombre: 'Lucía Moreno', diasSinEntrenar: 8, profesor: 'Laura Fernández' },
]

function StatCard({ value, label, icon, color }) {
  return (
    <div className={`card ${styles.statCard}`}>
      <span className={styles.statIcon}>{icon}</span>
      <span className={styles.statValue} style={{ color }}>
        {value}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats] = useState(MOCK_STATS)
  const [sinRutina] = useState(MOCK_SIN_RUTINA)
  const [sinEntrenar] = useState(MOCK_SIN_ENTRENAR)
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



  return (
    <>
      {loading
        ? <Loader />
        : <div className={styles.page}>
          <div className="page-header">
            <h1>PANEL <span>ADMIN</span></h1>
            <p>Resumen general del gimnasio.</p>
          </div>

          {/* Métricas */}
          <div className={styles.statsGrid}>
            <StatCard
              value={stats.alumnosActivos}
              label="Alumnos activos"
              icon={<IconAlumnanos />}
              color="#F5C518"
            />
            <StatCard
              value={stats.entrenamientosSemana}
              label="Entrenamientos esta semana"
              icon={<IconEjercicios />}
              color="#F5C518"
            />
            <StatCard
              value={stats.profesoresActivos}
              label="Profesores Activos"
              icon={<IconsProfesores />}
              color="#F5C518"
            />
          </div>

          <div className={styles.alertsGrid}>

            {/* Alumnos sin rutina */}
            <div className={`card ${styles.alertCard}`}>
              <div className={styles.alertHeader}>
                <div className={styles.alertTitleGroup}>
                  <span className={styles.alertIcon}>⚠️</span>
                  <h2 className={styles.alertTitle}>Sin rutina asignada</h2>
                </div>
                <span className={`badge badge--warning`}>{sinRutina.length}</span>
              </div>

              {sinRutina.length === 0 ? (
                <p className={styles.emptyAlert}>¡Todos los alumnos tienen rutina! 🎉</p>
              ) : (
                <div className={styles.alertList}>
                  {sinRutina.map(alumno => (
                    <div key={alumno.id} className={styles.alertItem}>
                      <div className={styles.alertAvatar}>
                        {alumno.nombre[0].toUpperCase()}
                      </div>
                      <div className={styles.alertInfo}>
                        <span className={styles.alertName}>{alumno.nombre}</span>
                        <span className={styles.alertSub}>
                          Profesor: {alumno.profesor}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Link to="/admin/alumnos" className={`btn btn--outline btn--sm ${styles.alertLink}`}>
                Gestionar alumnos
              </Link>
            </div>

            {/* Alumnos sin entrenar */}
            <div className={`card ${styles.alertCard}`}>
              <div className={styles.alertHeader}>
                <div className={styles.alertTitleGroup}>
                  <span className={styles.alertIcon}>😴</span>
                  <h2 className={styles.alertTitle}>Sin entrenar +7 días</h2>
                </div>
                <span className={`badge badge--error`}>{sinEntrenar.length}</span>
              </div>

              {sinEntrenar.length === 0 ? (
                <p className={styles.emptyAlert}>¡Todos entrenaron esta semana! 🎉</p>
              ) : (
                <div className={styles.alertList}>
                  {sinEntrenar.map(alumno => (
                    <div key={alumno.id} className={styles.alertItem}>
                      <div className={styles.alertAvatar}>
                        {alumno.nombre[0].toUpperCase()}
                      </div>
                      <div className={styles.alertInfo}>
                        <span className={styles.alertName}>{alumno.nombre}</span>
                        <span className={styles.alertSub}>
                          Profesor: {alumno.profesor}
                        </span>
                      </div>
                      <span className={`badge badge--error`}>
                        {alumno.diasSinEntrenar}d
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <Link to="/admin/alumnos" className={`btn btn--outline btn--sm ${styles.alertLink}`}>
                Gestionar alumnos
              </Link>
            </div>

          </div>
        </div>
      }
    </>
  )
}