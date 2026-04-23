import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Sidebar.module.scss'

const NAV_ITEMS = {
  alumno: [
    { to: '/alumno',           label: 'Dashboard', icon: '⊞' },
    { to: '/alumno/rutina',    label: 'Mi Rutina',  icon: '📋' },
    { to: '/alumno/historial', label: 'Historial',  icon: '📈' },
    { to: '/alumno/encuesta',  label: 'Encuesta',   icon: '💬' },
    { to: '/alumno/perfil',           label: 'Mi Perfil',  icon: '👤' },
  ],
  profesor: [
    { to: '/profesor',         label: 'Dashboard', icon: '⊞' },
    { to: '/profesor/alumnos', label: 'Alumnos',   icon: '👥' },
    { to: '/profesor/ejercicios', label: 'Ejercicios',   icon: '📋' },
    { to: '/profesor/perfil',           label: 'Mi Perfil', icon: '👤' },
  ],
  admin: [
  { to: '/admin',          label: 'Dashboard', icon: '⊞' },
  { to: '/admin/usuarios', label: 'Profesores', icon: '👨‍🏫' },
  { to: '/admin/alumnos',  label: 'Alumnos',   icon: '👥' },
  { to: '/admin/perfil',         label: 'Mi Perfil', icon: '👤' },
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
          <span className={styles.logo}>{collapsed ? 'A' : 'AIMAR'}</span>
          <button className={styles.toggle} onClick={onToggle}>
            {collapsed ? '→' : '←'}
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
          <span className={styles.icon}>⏻</span>
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </aside>
    </>
  )
}