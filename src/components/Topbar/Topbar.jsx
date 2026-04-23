import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Topbar.module.scss'

const ROLE_LABELS = {
  alumno:   'Panel Alumno',
  profesor: 'Panel Profesor',
  admin:    'Panel Admin',
}

export default function Topbar() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className={styles.topbar}>
      <span className={styles.roleLabel}>{ROLE_LABELS[role]}</span>
      <div className={styles.right}>
        <span className={styles.greeting}>
          Hola, <strong>{user?.name?.split(' ')[0]}</strong>
        </span>
        <div className={styles.avatar}>
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout} title="Cerrar sesión">
          ⏻
        </button>
      </div>
    </header>
  )
}