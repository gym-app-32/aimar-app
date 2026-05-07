

import React from 'react'
import styles from './Rutina.module.scss'

// ─── Indicador semanas ────────────────────────────────────

function getDiaSemanaActual() {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

function formatFecha(str) {
  return new Date(str + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}



function SemanaIndicador({ semanaActual, totalSemanas }) {
  return (
    <div className={styles.semanaIndicador}>
      <span className={styles.semanaLabel}>Semana {semanaActual} de {totalSemanas}</span>
      <div className={styles.semanaBarras}>
        {Array.from({ length: totalSemanas }, (_, i) => {
          const num = i + 1
          const completada = num < semanaActual
          const enProceso = num === semanaActual
          const progreso = completada ? '100%' : enProceso
            ? `${Math.round(((getDiaSemanaActual() + 1) / 7) * 100)}%` : '0%'
          return (
            <div key={num} className={`${styles.semanaBarraWrapper} ${enProceso ? styles.enProceso : ''}`}>
              <div className={styles.semanaNum}>S{num}</div>
              <div className={styles.semanaBarra}>
                <div
                  className={`${styles.semanaBarraFill} ${completada ? styles.completada : ''} ${enProceso ? styles.enProcesoFill : ''}`}
                  style={{ width: progreso }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function HeaderRutina({titulo, inicio, semanas, dias}) {

  const cantDias = dias.length
  const fechaInit = formatFecha(inicio)

  const semanaActual = 3

  return (
    <div className={`card ${styles.rutinaHeader}`}>
      <div className={styles.rutinaHeaderTop}>
        <div>
          <h2 className={styles.rutinaNombre}>{titulo}</h2>
          <div className={styles.rutinaMeta}>
            <span>📅 {fechaInit}</span>
            <span>⏳ {semanas} semanas</span>
            <span>📋 {cantDias} días</span>
          </div>
        </div>
        <span className="badge badge--gold">Activa</span>
      </div>
      <SemanaIndicador semanaActual={semanaActual} totalSemanas={semanas} />
    </div>

  )
}
