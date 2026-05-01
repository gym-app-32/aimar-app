import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Topbar.module.scss'
import { IconLogOut } from '../Icons/Icons'

const ROLE_LABELS = {
  alumno: 'Alumno',
  profesor: 'Profesor',
  admin: 'Admin',
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
        <div className={styles.avatar}>
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className={styles.greeting}>
          Hola, <br /><strong>{user?.name?.split(' ')[0]}</strong>
        </span>
      </div>
      <button className={styles.logoutBtn} onClick={handleLogout} title="Cerrar sesión">
        <span className={styles.icon}><IconLogOut /></span>
        <span className={styles.textBtn}>Cerrar sesión</span>
      </button>
    </header>
  )
}