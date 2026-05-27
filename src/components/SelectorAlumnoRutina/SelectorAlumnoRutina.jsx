import { useState } from "react";
import Modal from "../UI/Modal/Modal";
import AlumnoCard from "./AlumnoCard";
import AlumnoSelector from "./AlumnoSelector";
import RutinaBuilder from "./RutinaBuilder";
import styles from './SelectorAlumnoRutina.module.scss'



function nuevaDia() {
  return {
    id: Date.now() + Math.random(),
    nombre: '',
    gruposMusculares: '',
    precalentamiento: nuevaSerie(),
    series: [nuevaSerie()],
    postentrenamiento: nuevaSerie(),
  }
}

function nuevaSerie() {
  return { id: Date.now() + Math.random(), repeticionesSerie: 3, descanso: 60, ejercicios: [] }
}


export default function SelectorAlumnoRutina({listaAlumnos}) {
  const [alumnos, setAlumnos] = useState(listaAlumnos)
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null)
  const [builderOpen, setBuilderOpen] = useState(false)
  const [builderModo, setBuilderModo] = useState('crear') // 'crear' | 'editar'
  const [confirmEliminar, setConfirmEliminar] = useState(false)


  const abrirBuilder = (modo) => {
    setBuilderModo(modo)
    setBuilderOpen(true)
  }

  const handleGuardar = (rutina) => {
    setAlumnos(prev => prev.map(a =>
      a.id === alumnoSeleccionado.id
        ? { ...a, rutina: { id: a.rutina?.id || Date.now(), ...rutina } }
        : a
    ))
    setAlumnoSeleccionado(prev => ({
      ...prev,
      rutina: { id: prev.rutina?.id || Date.now(), ...rutina }
    }))
    setBuilderOpen(false)
  }

  const handleEliminarRutina = () => {
    setAlumnos(prev => prev.map(a =>
      a.id === alumnoSeleccionado.id ? { ...a, rutina: null } : a
    ))
    setAlumnoSeleccionado(prev => ({ ...prev, rutina: null }))
    setConfirmEliminar(false)
  }
 return (
    <>
      <AlumnoSelector
        alumnos={alumnos}
        onSeleccionar={setAlumnoSeleccionado}
      />

      {alumnoSeleccionado
        ? <AlumnoCard
            alumno={alumnoSeleccionado}
            onCrearRutina={() => abrirBuilder('crear')}
            onEditarRutina={() => abrirBuilder('editar')}
            onEliminarRutina={() => setConfirmEliminar(true)}
          />
        : <div className={`card ${styles.emptyState}`}>
            <span className={styles.emptyIcon}>🔍</span>
            <p className={styles.emptyTitle}>No hay alumno seleccionado</p>
            <p className={styles.emptySubtitle}>Buscá un alumno para ver o gestionar su rutina.</p>
          </div>
      }

      <RutinaBuilder
        isOpen={builderOpen}
        onClose={() => setBuilderOpen(false)}
        onGuardar={handleGuardar}
        alumno={alumnoSeleccionado}
        modo={builderModo}
        nuevoDia={nuevaDia}
        nuevaSerie={nuevaSerie}
      />

      <Modal
        isOpen={confirmEliminar}
        onClose={() => setConfirmEliminar(false)}
        title="ELIMINAR RUTINA"
        maxWidth="420px"
      >
        <div className={styles.confirmBody}>
          <p>¿Estás seguro que querés eliminar la rutina de <strong>{alumnoSeleccionado?.nombre}</strong>?</p>
          <p className={styles.confirmWarning}>Esta acción no se puede deshacer.</p>
        </div>
        <div className={styles.confirmFooter}>
          <button className="btn btn--ghost" onClick={() => setConfirmEliminar(false)}>Cancelar</button>
          <button className="btn btn--danger" onClick={handleEliminarRutina}>Sí, eliminar</button>
        </div>
      </Modal>
    </>
  )
}
