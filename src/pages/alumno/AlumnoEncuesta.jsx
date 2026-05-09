import { useEffect, useState } from 'react'
import styles from './AlumnoEncuesta.module.scss'
import BodyMap from '../../components/UI/BodyMap/BodyMap'
import BodyMapWrapper from '../../components/UI/BodyMap/BodyMapWrapper'
import Loader from '../../components/Loader/Loader'
import FormularioEncueste from '../../components/FormularioEncuesta/FormularioEncuesta'

const MOCK_ENTRENAMIENTOS_HOY = [
  {
    id: 1,
    tipo: 'rutina',
    nombre: 'Día 1 — Piernas',
    fecha: '08/05/2025',
    hora: '19:30',
    encuestaCompletada: false,
  },
  {
    id: 2,
    tipo: 'clase',
    nombre: 'Kickboxing Recreativo',
    fecha: '09/05/2025',
    hora: '21:00',
    encuestaCompletada: false,
  },
  {
    id: 3,
    tipo: 'rutina',
    nombre: 'Día 2 — Espalda',
    fecha: '05/05/2025',
    hora: '19:00',
    encuestaCompletada: true, // ya completada — no se puede volver a hacer
  },
  {
    id: 4,
    tipo: 'clase',
    nombre: 'Kickboxing Recreativo',
    fecha: '04/05/2025',
    hora: '21:00',
    encuestaCompletada: true, // ya completada — no se puede volver a hacer
  },
]


// ─── Página principal ─────────────────────────────────────
export default function AlumnoEncuesta() {
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


  const [entrenamientos, setEntrenamientos] = useState(MOCK_ENTRENAMIENTOS_HOY)
  const [entrenamientoActivo, setEntrenamientoActivo] = useState(null)
  const [completados, setCompletados] = useState([])

  const handleEnviado = (entrenamientoId) => {
    setEntrenamientos(prev =>
      prev.map(e => e.id === entrenamientoId ? { ...e, encuestaCompletada: true } : e)
    )
    setCompletados(prev => [...prev, entrenamientoId])
    setEntrenamientoActivo(null)
  }

  const pendientes = entrenamientos.filter(e => !e.encuestaCompletada)
  const completadas = entrenamientos.filter(e => e.encuestaCompletada)

  // Si está completando una encuesta, mostrar el formulario
  if (entrenamientoActivo) {
    return (
      <div className={styles.page}>
        <div className="page-header">
          <h1>COMPLETA LA <span>ENCUESTA</span></h1>
          <p>Contale a tu profe cómo te sentiste en este entrenamiento.</p>
        </div>
        <FormularioEncueste
          entrenamiento={entrenamientoActivo}
          onEnviado={handleEnviado}
          onCancelar={() => setEntrenamientoActivo(null)}
        />
      </div>
    )
  }

  //-------- Tarjeta Completada ---------------------
  const CardCompletada = ({ key, ent }) => {
    return (
      <div key={key} className={`card ${styles.entrenamientoCard} ${styles.completada}`}>
        <div className={styles.entrenamientoInfo}>
          <span className={`badge ${ent.tipo === 'rutina' ? 'badge--gold' : 'badge--success'}`}>
            {ent.tipo === 'rutina' ? '💪 Rutina' : '🥊 Clase'}
          </span>
          <div>
            <span className={styles.entrenamientoNombre}>{ent.nombre}</span>
            <span className={styles.entrenamientoHora}>📅 {ent.fecha} &nbsp;🕐 {ent.hora}</span>
          </div>
        </div>
        <span className={styles.checkIcon}>✓ Enviada</span>
      </div>

    )
  }

  //-------- Tarjeta Pendiente ---------------------
  const CardPendiente = ({ key, ent }) => {
    return (
      <div key={key} className={`card ${styles.entrenamientoCard}`}>
        <div className={styles.entrenamientoInfo}>
          <span className={`badge ${ent.tipo === 'rutina' ? 'badge--gold' : 'badge--success'}`}>
            {ent.tipo === 'rutina' ? '💪 Rutina' : '🥊 Clase'}
          </span>
          <div>
            <span className={styles.entrenamientoNombre}>{ent.nombre}</span>
            <span className={styles.entrenamientoHora}>📅 {ent.fecha} &nbsp;🕐 {ent.hora}</span>
          </div>
        </div>
        <button
          className="btn btn--primary btn--sm"
          onClick={() => setEntrenamientoActivo(ent)}
        >
          Completar encuesta
        </button>
      </div>

    )
  }

  return (
    <>
      {loading
        ? <Loader />
        : <div className={styles.page}>
          <div className="page-header">
            <h1>ENCUESTA DE <span>POSTENTRENAMIENTO</span></h1>
            <p>Completá una encuesta por cada entrenamiento de hoy.</p>
          </div>
          {/* Todo completado */}
          {pendientes.length === 0 && completadas.length > 0 && (
            <div className={`card ${styles.successCard}`}>
              <span className={styles.successIcon}>✓</span>
              <div>
                <h3>¡Todo al día!</h3>
                <p>Completaste todas las encuestas de hoy. Tu profe ya puede ver tus resultados.</p>
              </div>
            </div>
          )}

          {/* Sin entrenamientos hoy */}
          {entrenamientos.length === 0 && (
            <div className={styles.vacio}>
              <span className={styles.vacioIcon}>📅</span>
              <p>No registraste entrenamientos hoy.</p>
            </div>
          )}

          {/* Pendientes */}
          {pendientes.length > 0 && (
            <div className={styles.seccion}>
              <h2 className={styles.seccionTitulo}>
                Pendientes <span className="badge badge--warning">{pendientes.length}</span>
              </h2>
              <div className={styles.lista}>
                {pendientes.map(ent => (
                  <CardPendiente
                    key={ent.id}
                    ent={ent}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completadas */}
          {completadas.length > 0 && (
            <div className={styles.seccion}>
              <h2 className={styles.seccionTitulo}>
                Completadas <span className="badge badge--success">{completadas.length}</span>
              </h2>
              <div className={styles.lista}>
                {completadas.map(ent => (
                  <CardCompletada
                    key={ent.id}
                    ent={ent}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      }
    </>
  )
}