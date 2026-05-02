import { useState } from 'react'
import Modal from '../../components/UI/Modal/Modal'
import TablaProfesores from '../../components/TablaProfesores/TablaProfesores'
import styles from './AdminProfesores.module.scss'
import { IconDelete, IconEdit } from '../../components/Icons/Icons'
import ListaActividades from '../../components/ListaActividades/ListaActividades'

const MOCK_ESPECIALIDADES_INIT = [
  { id: 1, nombre: 'Musculación', abreviatura: 'Musculación', descripcion: 'Entrenamiento con pesas y máquinas.' },
  { id: 2, nombre: 'Entrenamiento Funcional', abreviatura: 'Funcional', descripcion: 'Entrenamiento funcional y circuitos.' },
  { id: 3, nombre: 'Boxeo', abreviatura: 'Boxeo', descripcion: 'Técnica y entrenamiento de boxeo.' },
  { id: 4, nombre: 'Kickboxing Recreativo', abreviatura: 'Kickboxing', descripcion: 'Técnica y entrenamiento de kickboxing.' },
  { id: 5, nombre: 'Judo', abreviatura: 'Judo', descripcion: 'Arte marcial y entrenamiento de judo.' },
  { id: 6, nombre: 'Masajes Deportivos', abreviatura: 'Masajes', descripcion: 'Masajes deportivos y recuperación.' },
  { id: 7, nombre: 'Entrenamiento Personalizado', abreviatura: 'Personal', descripcion: 'Plan personalizado por objetivos.' },
]

const MOCK_PROFESORES_INIT = [
  { id: 1, nombre: 'Martín Gómez',    email: 'martin@aimar.com', telefono: '221 4567890', dni: '28123456', sexo: 'M', especialidad: 'Musculación', activo: true },
  { id: 2, nombre: 'Laura Fernández', email: 'laura@aimar.com',  telefono: '221 5678901', dni: '31456789', sexo: 'F', especialidad: 'Funcional',   activo: true },
  { id: 3, nombre: 'Diego Rojas',     email: 'diego@aimar.com',  telefono: '221 6789012', dni: '29789012', sexo: 'M', especialidad: 'Boxeo',       activo: false },
  { id: 4, nombre: 'Carla Méndez',    email: 'carla@aimar.com',  telefono: '221 7890123', dni: '33012345', sexo: 'F', especialidad: 'Kickboxing',  activo: true },
]

// ─── Subcomponente Profesores ─────────────────────────────
function TabProfesores({ profesores, setProfesores, especialidades }) {
  return (
    <TablaProfesores
      profesores={profesores} 
      setProfesores={setProfesores} 
      especialidades={especialidades}
    />
  )
}

// ─── Subcomponente Especialidades ─────────────────────────
function TabEspecialidades({ especialidades, setEspecialidades }) {
  return (
    <ListaActividades 
      especialidades={especialidades} 
      setEspecialidades={setEspecialidades} 
    />
  )
}

function StartCard({ num, label }) {
  return (
    <div className={`card ${styles.statCard}`}>
      <span className={styles.statValue}>{num}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────
export default function AdminProfesores() {
  const [tab, setTab] = useState('profesores')
  const [profesores, setProfesores] = useState(MOCK_PROFESORES_INIT)
  const [especialidades, setEspecialidades] = useState(MOCK_ESPECIALIDADES_INIT)

  const totalActivos = profesores.filter(p => p.activo).length

  return (
    <div className={styles.page}>
      <div className="page-header">
        <h1>GESTIÓN DE <span>PROFESORES</span></h1>
        <p>Administrá profesores y especialidades del gimnasio.</p>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <StartCard num={profesores.length} label="Total profesores" />
        <StartCard num={totalActivos} label="Activos" />
        <StartCard num={especialidades.length} label="Especialidades" />
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'profesores' ? styles.tabActive : ''}`}
          onClick={() => setTab('profesores')}
        >
          👨‍🏫 Profesores
        </button>
        <button
          className={`${styles.tab} ${tab === 'especialidades' ? styles.tabActive : ''}`}
          onClick={() => setTab('especialidades')}
        >
          🏷️ Especialidades
        </button>
      </div>

      {tab === 'profesores' && <TabProfesores profesores={profesores} setProfesores={setProfesores} especialidades={especialidades} />}
      {tab === 'especialidades' && <TabEspecialidades especialidades={especialidades} setEspecialidades={setEspecialidades} />}
    </div>
  )
}