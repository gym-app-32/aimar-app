import { useState } from 'react'
import styles from './CalendarioHistorial.module.scss'

// ─── Helpers ──────────────────────────────────────────────
const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function getFechasConEntrenamiento(listaEntrenamientos) {
  return new Set(listaEntrenamientos.map(e => e.fecha))
}


export default function CalendarioHistorial({ fechaSeleccionada, onSelectFecha, listaEntrenamientos }) {  
  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth())
  const [año, setAño] = useState(hoy.getFullYear())
  

  const cambiarMes = (dir) => {
    const nuevaFecha = new Date(año, mes + dir, 1)
    setMes(nuevaFecha.getMonth())
    setAño(nuevaFecha.getFullYear())
    onSelectFecha(null)
  }


  const fechasConEntrenamiento = getFechasConEntrenamiento(listaEntrenamientos)

  const primerDia = new Date(año, mes, 1).getDay()
  const diasEnMes = new Date(año, mes + 1, 0).getDate()

  const celdas = []
  for (let i = 0; i < primerDia; i++) celdas.push(null)
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d)

  return (
    <div className={styles.calendario}>
      <div className={styles.calHeader}>
        <button className={styles.calNavBtn} onClick={() => cambiarMes(-1)}>‹</button>
        <span className={styles.calMes}>{MESES[mes]} {año}</span>
        <button className={styles.calNavBtn} onClick={() => cambiarMes(1)}>›</button>
      </div>

      <div className={styles.calGrid}>
        {DIAS_SEMANA.map(d => (
          <div key={d} className={styles.calDiaNombre}>{d}</div>
        ))}
        {celdas.map((dia, i) => {
          if (!dia) return <div key={`empty-${i}`} />
          const fechaStr = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
          const tieneEntrenamiento = fechasConEntrenamiento.has(fechaStr)
          const seleccionado = fechaStr === fechaSeleccionada
          const hoy = new Date().toISOString().split('T')[0] === fechaStr

          return (
            <div
              key={dia}
              className={`
                ${styles.calDia}
                ${tieneEntrenamiento ? styles.calDiaCon : ''}
                ${seleccionado ? styles.calDiaSeleccionado : ''}
                ${hoy ? styles.calDiaHoy : ''}
              `}
              onClick={() => tieneEntrenamiento && onSelectFecha(fechaStr)}
            >
              <span>{dia}</span>
              {tieneEntrenamiento && (
                <div className={styles.calDot} />
              )}
            </div>
          )
        })}
      </div>

      <div className={styles.calLeyenda}>
        <div className={styles.calLeyendaItem}>
          <div className={styles.calDot} />
          <span>Entrenamiento</span>
        </div>
        <div className={styles.calLeyendaItem}>
          <div className={`${styles.calDiaHoyDot}`} />
          <span>Hoy</span>
        </div>
      </div>
    </div>
  )
}
