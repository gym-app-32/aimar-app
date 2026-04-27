import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Sidebar.module.scss'
import LogoSinRotulo from '../Logos/LogoSinRotulo'
import LogoMini from '../Logos/LogoMini'
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

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { role, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const items = NAV_ITEMS[role] || []

  // Cierra el drawer en móvil al cambiar de ruta
  useEffect(() => {
    onMobileClose?.()
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Overlay móvil */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={onMobileClose} />
      )}

      <aside className={`
        ${styles.sidebar}
        ${collapsed ? styles.collapsed : ''}
        ${mobileOpen ? styles.mobileOpen : ''}
      `}>
        <div className={styles.header}>
          <span className={styles.logo}>{collapsed ? <LogoMini className='logo-mini'/> : <LogoSinRotulo />}</span>
          <button className={styles.toggle} onClick={onToggle}>
            {collapsed ? '>' : '<'}
          </button>
        </div>

        {!collapsed && (
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name}</span>
            <span className={styles.userRole}>{role}</span>
          </div>
        )}

        <nav className={styles.nav}>
          {items.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to.split('/').length === 2}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.icon}>{icon}</span>
              {!collapsed && <span className={styles.label}>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <button className={styles.logout} onClick={handleLogout}>
          <span className={styles.icon}><IconLogOut /></span>
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </aside>
    </>
  )
}