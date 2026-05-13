import { useEffect, useState } from 'react'
import styles from './ProfesorEjercicios.module.scss'
import Loader from '../../components/Loader/Loader'
import ListaUtilitarios from '../../components/ListaUtilitarios/ListaUtilitarios'
import ListaEjercicios from '../../components/ListaEjercicios/ListaEjercicios'
import { useAuth } from '../../context/AuthContext'

const MOCK_UTILITARIOS = [
  { id: 1, nombre: 'Barra olímpica', descripcion: 'Barra de 20kg para ejercicios compuestos.', imagen: null },
  { id: 2, nombre: 'Mancuernas',     descripcion: 'Par de mancuernas ajustables de 2 a 40kg.', imagen: null },
  { id: 3, nombre: 'Soga de saltar', descripcion: 'Soga para calentamiento y cardio.',          imagen: null },
  { id: 4, nombre: 'Press de banca', descripcion: 'Banco regulable para press y ejercicios de pecho.', imagen: null },
  { id: 5, nombre: 'Polea alta',     descripcion: 'Máquina de polea para jalones y tríceps.',   imagen: null },
  { id: 6, nombre: 'Kettlebell',     descripcion: 'Pesas rusas de distintos pesos para funcional.', imagen: null },
]

const MOCK_EJERCICIOS = [
  { id: 1, nombre: 'Sentadilla con barra', descripcion: 'Ejercicio compuesto para piernas y glúteos.', video: '', utilitarios: [1, 4], imagen: null },
  { id: 2, nombre: 'Press de banca',       descripcion: 'Ejercicio de empuje para pecho y tríceps.',   video: '', utilitarios: [1, 4], imagen: null },
  { id: 3, nombre: 'Remo con barra',       descripcion: 'Ejercicio de tirón para espalda y bíceps.',   video: '', utilitarios: [1],    imagen: null },
  { id: 4, nombre: 'Curl de bíceps',       descripcion: 'Ejercicio de aislamiento para bíceps.',       video: '', utilitarios: [2],    imagen: null },
  { id: 5, nombre: 'Salto a la soga',      descripcion: 'Ejercicio cardiovascular de calentamiento.',  video: '', utilitarios: [3],    imagen: null },
]

export default function ProfesorEjercicios() {
  const { puedeHacer } = useAuth()
  const [tab, setTab]       = useState('ejercicios')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {loading
        ? <Loader />
        : <div className={styles.page}>
            <div className="page-header">
              <h1>EJERCICIOS Y <span>UTILITARIOS</span></h1>
              <p>Gestioná el catálogo de ejercicios y equipamiento.</p>
            </div>

            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${tab === 'ejercicios' ? styles.active : ''}`}
                onClick={() => setTab('ejercicios')}
              >
                Ejercicios
              </button>
              <button
                className={`${styles.tab} ${tab === 'utilitarios' ? styles.active : ''}`}
                onClick={() => setTab('utilitarios')}
              >
                Utilitarios
              </button>
            </div>

            {tab === 'utilitarios' && (
              <ListaUtilitarios
                utilitarios={MOCK_UTILITARIOS}
                puedeCrear={puedeHacer('utilitarios', 'crear')}
                puedeEditar={puedeHacer('utilitarios', 'editar')}
                puedeEliminar={puedeHacer('utilitarios', 'eliminar')}
              />
            )}

            {tab === 'ejercicios' && (
              <ListaEjercicios
                ejercicios={MOCK_EJERCICIOS}
                utilitarios={MOCK_UTILITARIOS}
                puedeCrear={puedeHacer('ejercicios', 'crear')}
                puedeEditar={puedeHacer('ejercicios', 'editar')}
                puedeEliminar={puedeHacer('ejercicios', 'eliminar')}
              />
            )}
          </div>
      }
    </>
  )
}