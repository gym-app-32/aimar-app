import { useState } from 'react'
import styles from './DetallesDiaSeleccionado.module.scss'

// ─── Helpers ──────────────────────────────────────────────
function FatigaBadge({ valor, label }) {
  const color = valor <= 4 ? 'success' : valor <= 7 ? 'warning' : 'error'
  return (
    <div className={styles.fatigaItem}>
      <span className={styles.fatigaLabel}>{label}</span>
      <span className={`badge badge--${color}`}>{valor}/10</span>
    </div>
  )
}


// ─── Detalle del día ──────────────────────────────────────
function DetalleDia({ ent }) {
  const [expandido, setExpandido] = useState(null)

  return (
    <div key={ent.id} className={`card ${styles.entrenamientoCard}`}>
      <div
        className={styles.entrenamientoHeader}
        onClick={() => setExpandido(expandido === ent.id ? null : ent.id)}
      >
        <div className={styles.entrenamientoLeft}>
          <span className={`badge ${ent.tipo === 'rutina' ? 'badge--gold' : 'badge--success'}`}>
            {ent.tipo === 'rutina' ? '💪 Rutina' : '🥊 Clase'}
          </span>
          <div>
            <span className={styles.entrenamientoNombre}>{ent.nombre}</span>
            {ent.rutina && (
              <span className={styles.entrenamientoRutina}>{ent.rutina}</span>
            )}
          </div>
        </div>
        <div className={styles.entrenamientoRight}>
          <span className={styles.entrenamientoMeta}>🕐 {ent.hora}</span>
          <span className={styles.entrenamientoMeta}>⏱ {ent.duracion} min</span>
          <span className={styles.expandBtn}>
            {expandido === ent.id ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {expandido === ent.id && (
        <div className={styles.entrenamientoDetalle}>

          {/* Ejercicios */}
          {ent.ejercicios.length > 0 && (
            <div className={styles.ejerciciosList}>
              <span className={styles.detalleSeccion}>Ejercicios</span>
              {ent.ejercicios.map((ej, i) => (
                <div key={i} className={styles.ejercicioItem}>
                  <span className={styles.ejercicioNombre}>{ej.nombre}</span>
                  <div className={styles.ejercicioSeries}>
                    {ej.series.map((s, si) => (
                      <div key={si} className={styles.serieReps}>
                        {s.reps.map((r, ri) => (
                          <span key={ri} className={styles.repBubble}>
                            {r}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fatiga */}
          {ent.fatiga && (
            <div className={styles.fatigaSection}>
              <span className={styles.detalleSeccion}>Encuesta de fatiga</span>
              <div className={styles.fatigaGrid}>
                <FatigaBadge valor={ent.fatiga.cansancio} label="Cansancio" />
                <FatigaBadge valor={ent.fatiga.dolorMuscular} label="Dolor muscular" />
                <FatigaBadge valor={ent.fatiga.sueno} label="Calidad de sueño" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}



export default function DetallesDiaSeleccionado({ fecha, entrenamientos }) {

  if (!fecha) {
    return (
      <div  className={`card ${styles.detalleVacio}`}>
        <span className={styles.detalleVacioIcon}>📅</span>
        <p>Seleccioná un día con entrenamientos para ver el detalle.</p>
      </div>
    )
  }

  if (entrenamientos.length === 0) {
    return (
      <div className={styles.detalleVacio}>
        <span className={styles.detalleVacioIcon}>😴</span>
        <p>No hubo entrenamientos este día.</p>
      </div>
    )
  }

  function formatFecha(str) {
    const d = new Date(str + 'T00:00:00')
    return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  return (
    <>
      <div className={styles.detalle}>
        <h3 className={styles.detalleFecha}>{formatFecha(fecha)}</h3>

        {entrenamientos.map(ent => (
          <DetalleDia
            key={ent.id}
            ent={ent}
          />
        ))}

      </div>
    </>
  )
}
