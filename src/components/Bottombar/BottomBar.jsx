import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './BottomBar.module.scss'

import { IconAlumnanos, IconEjercicios, IconEncuesta, IconHistorialGym, IconIncioGym, IconLogOut, IconsProfesores, IconUser } from '../Icons/Icons'

const NAV_ITEMS = {
  alumno: [
    { to: '/alumno',           label: 'Rutina', icon: <IconIncioGym /> },
    { to: '/alumno/historial', label: 'Historial',  icon: <IconHistorialGym/> },
    { to: '/alumno/encuesta',  label: 'Encuesta',   icon: <IconEncuesta /> },
    { to: '/alumno/perfil',           label: 'Mi Perfil',  icon: <IconUser /> },
  ],
  profesor: [
    { to: '/profesor',         label: 'Rutinas', icon: <IconIncioGym />  },
    { to: '/profesor/alumnos', label: 'Alumnos',   icon: <IconAlumnanos /> },
    { to: '/profesor/ejercicios', label: 'Ejercicios',   icon: <IconEjercicios /> },
    { to: '/profesor/perfil',           label: 'Mi Perfil', icon: <IconUser /> },
  ],
  admin: [
  { to: '/admin',          label: 'Dashboard', icon: <IconIncioGym /> },
  { to: '/admin/usuarios', label: 'Profesores', icon: <IconsProfesores /> },
  { to: '/admin/alumnos',  label: 'Alumnos',   icon: <IconAlumnanos /> },
  { to: '/admin/perfil',         label: 'Mi Perfil', icon: <IconUser /> },
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