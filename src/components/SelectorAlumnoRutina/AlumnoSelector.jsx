import { useState, useMemo } from 'react'
import styles from './AlumnoSelector.module.scss'

export default function AlumnoSelector({ alumnos, onSeleccionar }) {
  const [busqueda, setBusqueda]       = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const alumnosFiltrados = useMemo(() =>
    alumnos.filter(a =>
      a.nombre.toLowerCase().includes(busqueda.toLowerCase())
    ), [alumnos, busqueda])

  const seleccionar = (alumno) => {
    onSeleccionar(alumno)
    setBusqueda(alumno.nombre)
    setDropdownOpen(false)
  }

  return (
    <div className={styles.selectorSection}>
      <label className={styles.selectorLabel}>Seleccionar alumno</label>
      <div className={styles.selectorWrapper}>
        <input
          type="text"
          className={styles.selectorInput}
          placeholder="Buscar alumno por nombre..."
          value={busqueda}
          onChange={e => {
            setBusqueda(e.target.value)
            setDropdownOpen(true)
            if (!e.target.value) onSeleccionar(null)
          }}
          onFocus={() => setDropdownOpen(true)}
        />
        {dropdownOpen && busqueda && (
          <div className={styles.dropdown}>
            {alumnosFiltrados.length === 0
              ? <div className={styles.dropdownEmpty}>No se encontraron alumnos</div>
              : alumnosFiltrados.map(a => (
                <div
                  key={a.id}
                  className={`${styles.dropdownItem} ${!a.activo ? styles.dropdownInactivo : ''}`}
                  onClick={() => seleccionar(a)}
                >
                  <div className={styles.dropdownAvatar}>{a.nombre[0].toUpperCase()}</div>
                  <div>
                    <span className={styles.dropdownNombre}>{a.nombre}</span>
                    <span className={styles.dropdownSub}>
                      {a.activo ? (a.rutina ? `📋 ${a.rutina.nombre}` : '⚠️ Sin rutina') : '🔒 Inactivo'}
                    </span>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  )
}