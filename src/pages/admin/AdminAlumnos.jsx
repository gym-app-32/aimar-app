import { useEffect, useState } from 'react'
import Modal from '../../components/UI/Modal/Modal'
import TablaAlumnos from '../../components/TablaAlumnos/TablaAlumnos'
import styles from './AdminAlumnos.module.scss'
import Loader from '../../components/Loader/Loader'

// ─── Mock data compartido ─────────────────────────────────
const MOCK_ESPECIALIDADES = [
  { id: 1, nombre: 'Musculación', abreviatura: 'Musculación' },
  { id: 2, nombre: 'Entrenamiento Funcional', abreviatura: 'Funcional' },
  { id: 3, nombre: 'Boxeo', abreviatura: 'Boxeo' },
  { id: 4, nombre: 'Kickboxing Recreativo', abreviatura: 'Kickboxing' },
  { id: 5, nombre: 'Judo', abreviatura: 'Judo' },
  { id: 6, nombre: 'Masajes Deportivos', abreviatura: 'Masajes' },
  { id: 7, nombre: 'Entrenamiento Personalizado', abreviatura: 'Personal' },
]

const MOCK_PROFESORES = [
  { id: 1, nombre: 'Martín Gómez', especialidad: 'Musculación' },
  { id: 2, nombre: 'Laura Fernández', especialidad: 'Funcional' },
  { id: 3, nombre: 'Diego Rojas', especialidad: 'Boxeo' },
  { id: 4, nombre: 'Carla Méndez', especialidad: 'Kickboxing' },
]

const MOCK_ALUMNOS = [
  {
    id: 1, nombre: 'Carlos Pérez', email: 'carlos@gmail.com', telefono: '221 1234567',
    fechaNacimiento: '1995-06-15', dni: '35123456', sexo: 'M',
    actividades: [
      { especialidadId: 1, profesorId: 1 },
      { especialidadId: 4, profesorId: 4 },
    ],
    rutina: 'Fuerza + Hipertrofia', activo: true,
  },
  {
    id: 2, nombre: 'Sofía López', email: 'sofia@gmail.com', telefono: '221 2345678',
    fechaNacimiento: '1998-03-22', dni: '38456789', sexo: 'F',
    actividades: [{ especialidadId: 2, profesorId: 2 }],
    rutina: 'Funcional Full Body', activo: true,
  },
  {
    id: 3, nombre: 'Tomás García', email: 'tomas@gmail.com', telefono: '221 3456789',
    fechaNacimiento: '2000-11-08', dni: '40789012', sexo: 'M',
    actividades: [],
    rutina: 'Sin asignar', activo: false,
  },
  {
    id: 4, nombre: 'Valentina Ruiz', email: 'vale@gmail.com', telefono: '221 4567890',
    fechaNacimiento: '1993-07-30', dni: '32345678', sexo: 'F',
    actividades: [{ especialidadId: 4, profesorId: 4 }],
    rutina: 'Kickboxing Básico', activo: true,
  },
  {
    id: 5, nombre: 'Nicolás Torres', email: 'nico@gmail.com', telefono: '221 5678901',
    fechaNacimiento: '1997-01-14', dni: '37901234', sexo: 'M',
    actividades: [],
    rutina: 'Sin asignar', activo: true,
  },
]



// ─── StatCard ─────────────────────────────────────────────
function StatCard({ num, label }) {
  return (
    <div className={`card ${styles.statCard}`}>
      <span className={styles.statValue}>{num}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────
export default function AdminAlumnos() {
  const [alumnos, setAlumnos] = useState(MOCK_ALUMNOS)
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


  const totalActivos = alumnos.filter(a => a.activo).length
  const sinRutina = alumnos.filter(a => a.rutina === 'Sin asignar').length

  return (
    <>
      {loading
        ? <Loader />
        : <div className={styles.page}>
          <div className="page-header">
            <h1>GESTIÓN DE <span>ALUMNOS</span></h1>
            <p>Creá, editá y administrá los alumnos del gimnasio.</p>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            <StatCard num={alumnos.length} label="Total alumnos" />
            <StatCard num={totalActivos} label="Activos" />
            <StatCard num={sinRutina} label="Sin rutina" />
          </div>

          {/* Tabla */}
          <TablaAlumnos
            alumnos={alumnos}
            setAlumnos={setAlumnos}
            listProfesores={MOCK_PROFESORES}
            listActividades={MOCK_ESPECIALIDADES}
          />
        </div>
      }
    </>
  )
}