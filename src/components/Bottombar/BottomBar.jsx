import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './BottomBar.module.scss'

const NAV_ITEMS = {
  alumno: [
    { to: '/alumno',           label: 'Inicio',   icon: '⊞' },
    { to: '/alumno/historial', label: 'Historial', icon: '📈' },
    { to: '/alumno/encuesta',  label: 'Encuestaaaa',  icon: '📋' },
    { to: '/alumno/perfil',           label: 'Perfil',    icon: '👤' },
  ],
  profesor: [
    { to: '/profesor',         label: 'Inicio',   icon: '⊞' },
    { to: '/profesor/alumnos', label: 'Alumnos',  icon: '👥' },
    { to: '/profesor/ejercicios', label: 'Ejercicios',  icon: '📋' },
    { to: '/profesor/perfil',           label: 'Perfil',   icon: '👤' },
  ],
  admin: [
    { to: '/admin',          label: 'Inicio',    icon: '⊞' },
    { to: '/admin/usuarios', label: 'Usuarios',  icon: '👥' },
    { to: '/admin/perfil',         label: 'Perfil',    icon: '👤' },
  ],
}

export default function BottomBar() {
  const { role } = useAuth()
  const items = NAV_ITEMS[role] || []

  return (
    <nav className={styles.bottombar}>
      {items.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to.split('/').length === 2}
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.icon}>{icon}</span>
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}