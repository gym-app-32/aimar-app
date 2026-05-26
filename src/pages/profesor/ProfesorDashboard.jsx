import { useState, useEffect } from 'react'
import Modal from '../../components/UI/Modal/Modal'

import styles from './ProfesorDashboard.module.scss'
import Loader from '../../components/Loader/Loader'
import AlumnoSelector from '../../components/SelectorAlumnoRutina/AlumnoSelector'
import AlumnoCard from '../../components/SelectorAlumnoRutina/AlumnoCard'
import RutinaBuilder from '../../components/SelectorAlumnoRutina/RutinaBuilder'
import SelectorAlumnoRutina from '../../components/SelectorAlumnoRutina/SelectorAlumnoRutina'


const MOCK_ALUMNOS = [
  { id: 1, nombre: 'Carlos Pérez',    rutina: { id: 1, nombre: 'Fuerza + Hipertrofia', inicio: '2025-01-01', semanas: 8, dias: [] }, activo: true },
  { id: 2, nombre: 'Sofía López',     rutina: { id: 2, nombre: 'Funcional Full Body',  inicio: '2025-01-06', semanas: 4, dias: [] }, activo: true },
  { id: 3, nombre: 'Tomás García',    rutina: null, activo: false },
  { id: 4, nombre: 'Valentina Ruiz',  rutina: { id: 3, nombre: 'Kickboxing Básico',    inicio: '2025-01-10', semanas: 6, dias: [] }, activo: true },
  { id: 5, nombre: 'Nicolás Torres',  rutina: null, activo: true },
]

export default function ProfesorDashboard() {
  const [loading, setLoading]                   = useState(true)
  

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(t)
  }, [])

  

  return (
    <>
      {loading
        ? <Loader />
        : <div className={styles.page}>
            <div className="page-header">
              <h1>PANEL <span>PROFESOR</span></h1>
              <p>Buscá un alumno para ver o gestionar su rutina.</p>
            </div>
            <SelectorAlumnoRutina listaAlumnos={MOCK_ALUMNOS}/>

          </div>
      }
    </>
  )
}