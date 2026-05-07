import React, { useState } from 'react'
import Modal from '../../UI/Modal/Modal'
import { MiniCalendario } from '../Rutina/SelectorFecha'
import styles from './Clase.module.scss'



export default function EntrenamientoClase({ listaClases, tabActiva, historialDias }) {
  const [claseRegistrada, setClaseRegistrada] = useState(false)
  const [claseNombreRegistrada, setClaseNombreRegistrada] = useState('')
  const [calClaseOpen, setCalClaseOpen] = useState(false)

  function fechaToStr(date) {
    return date.toISOString().split('T')[0]
  }

  const hoy = new Date()

  const [fechaClase, setFechaClase] = useState(fechaToStr(hoy))

  const handleRegistrarClase = (nombreClase) => {
    setClaseNombreRegistrada(nombreClase)
    setClaseRegistrada(true)
  }




  return (
    <>
      <>
        {listaClases.filter(c => c.id === tabActiva).map(clase => (
          <div key={clase.id}>
            {claseRegistrada ? (
              <div className={`card ${styles.completadoCard}`}>
                <div className={styles.completadoIcono}>✓</div>
                <h3>¡Asistencia registrada!</h3>
                <p>Tu asistencia a <strong>{claseNombreRegistrada}</strong> fue registrada correctamente.</p>
                <div className={styles.completadoEncuesta}>
                  <span>💬</span>
                  <span>Ya tenés habilitada tu <strong>encuesta de fatiga</strong>. ¡No te olvides de completarla!</span>
                </div>
                <button className="btn btn--outline btn--sm" onClick={() => setClaseRegistrada(false)}>
                  Registrar otra asistencia
                </button>
              </div>
            ) : (
              <div className={`card ${styles.claseCard}`}>
                <h2 className={styles.claseNombre}>{clase.nombre}</h2>
                <p className={styles.claseHorario}>📅 {clase.horario}</p>
                <div className={styles.claseField}>
                  <label className={styles.claseFieldLabel}>Fecha de la clase</label>
                  <div className={styles.claseFechaRow}>
                    <span className={styles.claseFechaStr}>
                      {new Date(fechaClase + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                    <button className={styles.calBtn} onClick={() => setCalClaseOpen(true)} title="Cambiar fecha">📅</button>
                  </div>
                </div>
                <button className="btn btn--primary" onClick={() => handleRegistrarClase(clase.nombre)}>
                  ✓ Registrar asistencia
                </button>
              </div>
            )}
          </div>
        ))}
      </>

      <Modal isOpen={calClaseOpen} onClose={() => setCalClaseOpen(false)} title="FECHA DE LA CLASE" maxWidth="360px">
        <MiniCalendario
          fechaSeleccionada={fechaClase}
          onSelect={setFechaClase}
          onClose={() => setCalClaseOpen(false)}
          mostrarHistorial
          historialDias={historialDias}
        />
      </Modal>

    </>
  )
}
