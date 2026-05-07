import React, { useState } from 'react'
import Modal from '../../UI/Modal/Modal'
import styles from './Rutina.module.scss'

function fechaToStr(date) {
  return date.toISOString().split('T')[0]
}

function getDiaSemanaActual() {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

function getLunesDeSemana() {
  const hoy = new Date()
  const dia = hoy.getDay()
  const diff = dia === 0 ? -6 : 1 - dia
  const lunes = new Date(hoy)
  lunes.setDate(hoy.getDate() + diff)
  return lunes
}

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

// ─── Mini Calendario ──────────────────────────────────────
export function MiniCalendario({ fechaSeleccionada, onSelect, onClose, mostrarHistorial = false, historialDias }) {
  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth())
  const [anio, setAnio] = useState(hoy.getFullYear())

  const primerDia = new Date(anio, mes, 1).getDay()
  const diasEnMes = new Date(anio, mes + 1, 0).getDate()
  const offsetInicio = primerDia === 0 ? 6 : primerDia - 1
  const celdas = Array(offsetInicio).fill(null)
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d)

  const cambiarMes = (dir) => {
    const nueva = new Date(anio, mes + dir, 1)
    setMes(nueva.getMonth())
    setAnio(nueva.getFullYear())
  }

  const seleccionar = (dia) => {
    if (!dia) return
    const str = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
    onSelect(str)
    onClose()
  }

  return (
    <div className={styles.miniCal}>
      <div className={styles.miniCalHeader}>
        <button className={styles.miniCalNav} onClick={() => cambiarMes(-1)}>‹</button>
        <span className={styles.miniCalMes}>{MESES[mes]} {anio}</span>
        <button className={styles.miniCalNav} onClick={() => cambiarMes(1)}>›</button>
      </div>
      <div className={styles.miniCalGrid}>
        {DIAS_SEMANA.map(d => (
          <div key={d} className={styles.miniCalDiaNombre}>{d}</div>
        ))}
        {celdas.map((dia, i) => {
          if (!dia) return <div key={`e-${i}`} />
          const str = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
          const esHoy = str === fechaToStr(hoy)
          const esSel = str === fechaSeleccionada
          const esFut = new Date(str + 'T00:00:00') > hoy
          const hist = mostrarHistorial && historialDias[str]
          return (
            <div
              key={dia}
              className={`${styles.miniCalDia} ${esHoy ? styles.miniCalHoy : ''} ${esSel ? styles.miniCalSel : ''} ${esFut ? styles.miniCalFut : ''}`}
              onClick={() => !esFut && seleccionar(dia)}
            >
              <span>{dia}</span>
              {hist && (
                <div className={`${styles.miniCalDot} ${hist.tipo === 'clase' ? styles.miniCalDotClase : ''}`} />
              )}
            </div>
          )
        })}
      </div>
      {mostrarHistorial && (
        <div className={styles.miniCalLeyenda}>
          <div className={styles.miniCalLeyendaItem}><div className={styles.miniCalDot} /><span>Rutina</span></div>
          <div className={styles.miniCalLeyendaItem}><div className={`${styles.miniCalDot} ${styles.miniCalDotClase}`} /><span>Clase</span></div>
        </div>
      )}
    </div>
  )
}



export default function SelectorFecha({ historialDias }) {
  const [diaHistorialModal, setDiaHistorialModal] = useState(null)
  const [calModalOpen, setCalModalOpen] = useState(false)

  function fechaToStr(date) {
    return date.toISOString().split('T')[0]
  }

  const hoy = new Date()

  const [fechaEntrenamiento, setFechaEntrenamiento] = useState(fechaToStr(hoy))


  const lunes = getLunesDeSemana()

  const diaActual = getDiaSemanaActual()
  const diasConNumero = DIAS_SEMANA.map((label, i) => {
    const fecha = new Date(lunes)
    fecha.setDate(lunes.getDate() + i)
    const str = fechaToStr(fecha)
    return { label, numero: fecha.getDate(), fecha: str, historial: historialDias[str] }
  })

  const fechaLabel = new Date(fechaEntrenamiento + 'T00:00:00').toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long'
  })


  return (
    <>
      <div className={styles.diasSemanaRow}>
        {fechaEntrenamiento !== fechaToStr(hoy) ? (
          <div className={styles.fechaSeleccionada} style={{ flex: 1 }}>
            <span>📌 Cargando para: <strong>{fechaLabel}</strong></span>
            <button className="btn btn--ghost btn--sm" onClick={() => setFechaEntrenamiento(fechaToStr(hoy))}>
              Volver a hoy
            </button>
          </div>
        ) : (
          <div className={styles.diasSemana}>
            {diasConNumero.map((dia, i) => (
              <div
                key={dia.label}
                className={`${styles.diaSemana} ${i === diaActual ? styles.diaHoy : ''} ${dia.historial ? styles.diaCon : ''}`}
                onClick={() => dia.historial && setDiaHistorialModal(dia)}
              >
                <span className={styles.diaSemanaLabel}>{dia.label}</span>
                <span className={styles.diaSemanaNum}>{dia.numero}</span>
                {dia.historial
                  ? <div className={`${styles.diaDot} ${dia.historial.tipo === 'clase' ? styles.diaDotClase : ''}`} />
                  : i === diaActual ? <div className={styles.diaHoyDot} /> : null
                }
              </div>
            ))}
          </div>
        )}
        <button className={styles.calBtn} onClick={() => setCalModalOpen(true)} title="Seleccionar fecha">📅</button>
      </div>


      <Modal isOpen={!!diaHistorialModal} onClose={() => setDiaHistorialModal(null)} title="ENTRENAMIENTO" maxWidth="380px">
        {diaHistorialModal && (
          <div className={styles.historialDialogo}>
            <span className={`badge ${diaHistorialModal.historial?.tipo === 'rutina' ? 'badge--gold' : 'badge--success'}`}>
              {diaHistorialModal.historial?.tipo === 'rutina' ? '💪 Rutina' : '🥊 Clase'}
            </span>
            <p className={styles.historialDialogoNombre}>{diaHistorialModal.historial?.nombre}</p>
            <p className={styles.historialDialogoFecha}>
              {new Date(diaHistorialModal.fecha + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        )}
      </Modal>

      <Modal isOpen={calModalOpen} onClose={() => setCalModalOpen(false)} title="SELECCIONAR FECHA" maxWidth="360px">
        <MiniCalendario
          fechaSeleccionada={fechaEntrenamiento}
          onSelect={setFechaEntrenamiento}
          onClose={() => setCalModalOpen(false)}
          mostrarHistorial
          historialDias={historialDias}
        />
      </Modal>
    </>


  )
}
