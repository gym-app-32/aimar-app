import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Modal from '../../UI/Modal/Modal'
import styles from './Rutina.module.scss'

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.5)
  } catch { }
}

// ─── Modal Ver Ejercicio ──────────────────────────────────
function EjercicioModal({ ejercicio }) {
  if (!ejercicio) return null
  return (
    <div className={styles.ejercicioModal}>
      <h3 className={styles.ejercicioModalNombre}>{ejercicio.nombre}</h3>
      {ejercicio.descripcion && <p className={styles.ejercicioModalDesc}>{ejercicio.descripcion}</p>}
      {ejercicio.video && (
        <a href={ejercicio.video} target="_blank" rel="noopener noreferrer" className={styles.ejercicioModalVideo}>
          ▶ Ver video de muestra
        </a>
      )}
      {ejercicio.utilitarios?.length > 0 && (
        <div className={styles.ejercicioModalUtils}>
          <span className={styles.ejercicioModalUtilsTitle}>Utilitarios necesarios</span>
          <div className={styles.ejercicioModalUtilsList}>
            {ejercicio.utilitarios.map((u, i) => (
              <div key={i} className={styles.utilItem}>
                <div className={styles.utilFoto}>
                  {u.foto ? <img src={u.foto} alt={u.nombre} /> : <span>🏋️</span>}
                </div>
                <span className={styles.utilNombre}>{u.nombre}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Modal Ver Rutina ─────────────────────────────────────
function VerRutinaModal({ dia }) {
  const bloques = [
    { data: dia.precalentamiento, titulo: '🔥 Precalentamiento', color: '#f0a500' },
    ...dia.series.map((s, i) => ({ data: s, titulo: `💪 Serie ${i + 1} · ${s.repeticionesSerie} series · ${s.descanso}s descanso`, color: '#F5C518' })),
    { data: dia.postentrenamiento, titulo: '🧘 Post-entrenamiento', color: '#52c07a' },
  ]
  return (
    <div className={styles.verRutina}>
      <div className={styles.verRutinaDayHeader}>
        <span className={styles.verRutinaDayNum}>Día {dia.id}</span>
        <span className={styles.verRutinaDayNombre}>{dia.nombre}</span>
        <span className={styles.verRutinaDayMusculos}>{dia.gruposMusculares}</span>
      </div>
      {bloques.map((bloque, bi) => (
        <div key={bi} className={styles.verRutinaBloque}>
          <span className={styles.verRutinaBloqueTitle} style={{ color: bloque.color }}>{bloque.titulo}</span>
          <div className={styles.verRutinaTabla}>
            {bloque.data.repeticionesSerie > 1 && (
              <div className={styles.verRutinaTablaHeader}>
                <span className={styles.verRutinaTablaEj}>Ejercicio</span>
                {Array.from({ length: bloque.data.repeticionesSerie }, (_, i) => (
                  <span key={i} className={styles.verRutinaTablaRep}>R{i + 1}</span>
                ))}
              </div>
            )}
            {bloque.data.ejercicios.map((ej, ei) => (
              <div key={ei} className={styles.verRutinaTablaRow}>
                <span className={styles.verRutinaTablaEj}>{ej.nombre}</span>
                {ej.reps.map((r, ri) => (
                  <span key={ri} className={styles.verRutinaTablaRep}>{r}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Temporizador barra ───────────────────────────────────

const TemporizadorBarra = forwardRef(function TemporizadorBarra({ segundos, onFin }, ref) {
  const [restantes, setRestantes] = useState(segundos)
  const [activo, setActivo] = useState(false)
  const intervalRef = useRef(null)

  useImperativeHandle(ref, () => ({
    reset() {
      clearInterval(intervalRef.current)
      setRestantes(segundos)
      setActivo(false)
    }
  }))

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const iniciar = () => {
    if (activo || restantes === 0) return
    setActivo(true)
    intervalRef.current = setInterval(() => {
      setRestantes(p => {
        if (p <= 1) {
          clearInterval(intervalRef.current)
          setActivo(false)
          playBeep()
          setTimeout(() => onFin(), 300)
          return 0
        }
        return p - 1
      })
    }, 1000)
  }

  const progreso = ((segundos - restantes) / segundos) * 100

  return (
    <div className={styles.temporizadorBarra}>
      <div className={styles.temporizadorFill} style={{ width: `${progreso}%` }} />
      <span className={styles.temporizadorTexto}>
        {restantes === 0 ? '✓ Listo' : activo ? `Descanso ${restantes}s` : `Descanso ${segundos}s`}
      </span>
      <button
        className={`${styles.temporizadorPlayBtn} ${activo ? styles.activo : ''} ${restantes === 0 ? styles.terminado : ''}`}
        onClick={iniciar}
        disabled={activo || restantes === 0}
        title="Iniciar descanso"
      >
        {restantes === 0 ? '✓' : activo ? '⏳' : '▶'}
      </button>
    </div>
  )
})


// ─── Carrusel de series ───────────────────────────────────
function CarruselSeries({ dia, onCompletado }) {
  const bloques = [
    { tipo: 'pre', data: dia.precalentamiento, titulo: '🔥 Precalentamiento', color: '#f0a500' },
    ...dia.series.map((s, i) => ({ tipo: 'serie', data: s, titulo: `💪 Serie ${i + 1}`, color: '#F5C518' })),
    { tipo: 'post', data: dia.postentrenamiento, titulo: '🧘 Post-entrenamiento', color: '#52c07a' },
  ]

  const [indiceActual, setIndiceActual] = useState(0)
  const [vueltaActual, setVueltaActual] = useState(0)
  const vueltaRef = useRef(0)
  const [completados, setCompletados] = useState([])
  const [guardado, setGuardado] = useState(false)
  const [pesos, setPesos] = useState({})
  const [ejercicioModal, setEjercicioModal] = useState(null)
  const carruselRef = useRef(null)
  const timerRef = useRef(null) // ref al componente timer para resetearlo

  const bloque = bloques[indiceActual]
  const esUltimo = indiceActual === bloques.length - 1
  const esteComp = completados.includes(indiceActual)
  const totalRepeticiones = bloque.data.repeticionesSerie

  const getPeso = (ejIdx, vIdx) => pesos[`${indiceActual}-${ejIdx}-${vIdx}`] || ''
  const setPeso = (ejIdx, vIdx, val) =>
    setPesos(p => ({ ...p, [`${indiceActual}-${ejIdx}-${vIdx}`]: val }))

  // Avanza a la siguiente vuelta/repetición del bloque
  const avanzarVuelta = useCallback(() => {
    const actual = vueltaRef.current
    if (actual < totalRepeticiones - 1) {
      const siguiente = actual + 1
      vueltaRef.current = siguiente
      setVueltaActual(siguiente)
      // Resetear el timer para la siguiente vuelta
      timerRef.current?.reset()
    }
  }, [totalRepeticiones])

  const marcarCompletado = async () => {
    const nuevos = [...completados, indiceActual]
    setCompletados(nuevos)
    // Resetear vuelta para el próximo bloque
    vueltaRef.current = 0
    setVueltaActual(0)
    if (esUltimo) {
      await new Promise(r => setTimeout(r, 600))
      setGuardado(true)
      onCompletado()
    } else {
      setTimeout(() => {
        setIndiceActual(p => p + 1)
        carruselRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }

  const utilitariosBloque = []
  bloque.data.ejercicios.forEach(ej => {
    ej.utilitarios?.forEach(u => {
      if (!utilitariosBloque.find(x => x.nombre === u.nombre)) utilitariosBloque.push(u)
    })
  })

  if (guardado) {
    return (
      <div className={`card ${styles.completadoCard}`}>
        <div className={styles.completadoIcono}>✓</div>
        <h3>¡Entrenamiento completado!</h3>
        <p>Tu progreso fue registrado. ¡Excelente trabajo!</p>
        <div className={styles.completadoEncuesta}>
          <span>💬</span>
          <span>Ya tenés habilitada tu <strong>encuesta de fatiga</strong>. ¡No te olvides de completarla!</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.carrusel} ref={carruselRef}>
      <div className={styles.carruselProgress}>
        {bloques.map((b, i) => (
          <div key={i} className={`${styles.carruselDot} ${i === indiceActual ? styles.carruselDotActive : ''} ${completados.includes(i) ? styles.carruselDotDone : ''}`} />
        ))}
      </div>

      <div className={styles.serieCard} style={{ borderColor: bloque.color + '44' }}>
        <div className={styles.serieCardHeader} style={{ borderColor: bloque.color + '22' }}>
          <span className={styles.serieTitulo} style={{ color: bloque.color }}>{bloque.titulo}</span>
          {totalRepeticiones > 1 && <span className={styles.serieCantidad}>× {totalRepeticiones} repeticiones</span>}
        </div>

        <div className={styles.tablaWrapper}>
          <div className={styles.tablaEjercicios}>

            {/* Header columnas R1, R2... */}
            {totalRepeticiones > 1 && (
              <div className={styles.tablaHeader}>
                <span className={styles.tablaColEj}>Ejercicio</span>
                {Array.from({ length: totalRepeticiones }, (_, i) => (
                  <span
                    key={i}
                    className={`${styles.tablaColRep} ${i === vueltaActual ? styles.colActiva : ''} ${i < vueltaActual ? styles.colCompletada : ''}`}
                  >
                    R{i + 1}
                  </span>
                ))}
              </div>
            )}

            {/* Filas ejercicios */}
            {bloque.data.ejercicios.map((ej, ei) => (
              <div key={ei} className={styles.tablaFila}>
                <span className={styles.tablaColEj}>
                  <span className={styles.tablaEjNum}>{ei + 1}</span>
                  <button className={styles.ejNombreBtn} onClick={() => setEjercicioModal(ej)}>
                    {ej.nombre}
                  </button>
                </span>
                {ej.reps.map((r, ri) => (
                  <div
                    key={ri}
                    className={`${styles.tablaColRep} ${ri === vueltaActual ? styles.colActiva : ''} ${ri < vueltaActual ? styles.colCompletada : ''}`}
                  >
                    <span className={styles.repBubble}>{r}</span>
                    {totalRepeticiones > 1 && (
                      <input
                        type="number" min={0} placeholder="kg"
                        value={getPeso(ei, ri)}
                        onChange={e => setPeso(ei, ri, e.target.value)}
                        className={`${styles.pesoInput} ${ri === vueltaActual ? styles.pesoInputActivo : ''}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}

            {/* Fila descanso */}
            {bloque.data.descanso > 0 && totalRepeticiones > 1 && (
              <div className={styles.tablaDescanso}>
                <span className={styles.tablaColEj}>⏱ Descanso</span>
                {Array.from({ length: totalRepeticiones }, (_, i) => (
                  <div
                    key={i}
                    className={`${styles.tablaColRep} ${i === vueltaActual ? styles.colActiva : ''} ${i < vueltaActual ? styles.colCompletada : ''}`}
                  >
                    <span className={styles.descansoBubble}>{bloque.data.descanso}s</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Timer — se remonta solo cuando cambia de bloque, no de vuelta */}
        {bloque.data.descanso > 0 && totalRepeticiones > 1 && !esteComp && (
          <TemporizadorBarra
            key={indiceActual}
            ref={timerRef}
            segundos={bloque.data.descanso}
            onFin={avanzarVuelta}
          />
        )}

        {/* Utilitarios */}
        {utilitariosBloque.length > 0 && (
          <div className={styles.utilitariosSection}>
            <span className={styles.utilitariosSectionTitle}>Utilitarios</span>
            <div className={styles.utilitariosList}>
              {utilitariosBloque.map((u, i) => (
                <div key={i} className={styles.utilChip}>
                  <div className={styles.utilChipFoto}>
                    {u.foto ? <img src={u.foto} alt={u.nombre} /> : <span>🏋️</span>}
                  </div>
                  <span>{u.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          className={styles.completarBtn}
          style={{ background: esteComp ? '#2a2a2a' : bloque.color }}
          onClick={marcarCompletado}
          disabled={esteComp}
        >
          {esteComp ? '✓ Completado' : esUltimo ? '✓ Finalizar entrenamiento' : 'Completado → Siguiente'}
        </button>
      </div>

      <div className={styles.miniaturas}>
        {bloques.map((b, i) => (
          <button
            key={i}
            className={`${styles.miniatura} ${i === indiceActual ? styles.miniaturaActive : ''} ${completados.includes(i) ? styles.miniaturaDone : ''}`}
            onClick={() => {
              setIndiceActual(i)
              vueltaRef.current = 0
              setVueltaActual(0)
            }}
          >
            {b.titulo.split(' ').slice(0, 2).join(' ')}
          </button>
        ))}
      </div>

      <Modal isOpen={!!ejercicioModal} onClose={() => setEjercicioModal(null)} title={ejercicioModal?.nombre?.toUpperCase() || ''} maxWidth="480px">
        <EjercicioModal ejercicio={ejercicioModal} />
      </Modal>
    </div>
  )
}




export default function EntrenamientoRutina({rutina }) {
    const [diaSeleccionado, setDiaSeleccionado] = useState(null)
    const [entrenamientoIniciado, setEntrenamientoIniciado] = useState(false)
    const [verRutinaOpen, setVerRutinaOpen] = useState(false)


  return (
    <>

      <div className={styles.selectorDias}>
        <span className={styles.selectorLabel}>
          {entrenamientoIniciado ? `Entrenando: Día ${diaSeleccionado.id} — ${diaSeleccionado.nombre}` : 'Elegí el día a entrenar:'}
        </span>
        {!entrenamientoIniciado ? (
          <div className={styles.selectorBtns}>
            {rutina.dias.map((dia) => (
              <button
                key={dia.id}
                className={`${styles.selectorBtn} ${diaSeleccionado?.id === dia.id ? styles.selectorBtnActive : ''}`}
                onClick={() => setDiaSeleccionado(dia)}
              >
                <span className={styles.selectorBtnNum}>Día {dia.id}</span>
                <span className={styles.selectorBtnNombre}>{dia.nombre}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.diaEnCurso}>
            <span className="badge badge--gold">Día {diaSeleccionado.id} — {diaSeleccionado.nombre}</span>
            <span className={styles.diaEnCursoMusculos}>{diaSeleccionado.gruposMusculares}</span>
          </div>
        )}
      </div>

      {diaSeleccionado && !entrenamientoIniciado && (
        <div className={`card ${styles.iniciarCard}`}>
          <div className={styles.iniciarInfo}>
            <h3 className={styles.iniciarNombre}>Día {diaSeleccionado.id} — {diaSeleccionado.nombre}</h3>
            <p className={styles.iniciarMusculos}>{diaSeleccionado.gruposMusculares}</p>
            <div className={styles.iniciarMeta}>
              <span>💪 {diaSeleccionado.series.length} series</span>
              <span>⏱ ~{diaSeleccionado.series.reduce((a, s) => a + s.repeticionesSerie * 3, 10)} min</span>
            </div>
          </div>
          <div className={styles.iniciarBtns}>
            <button className="btn btn--ghost" onClick={() => setVerRutinaOpen(true)}>👁 Ver rutina</button>
            <button className="btn btn--primary btn--lg" onClick={() => setEntrenamientoIniciado(true)}>Iniciar →</button>
          </div>
        </div>
      )}

      {diaSeleccionado && entrenamientoIniciado && (
        <CarruselSeries dia={diaSeleccionado} onCompletado={() => { }} />
      )}


      <Modal isOpen={verRutinaOpen} onClose={() => setVerRutinaOpen(false)} title={diaSeleccionado ? `DÍA ${diaSeleccionado.id} — ${diaSeleccionado.nombre.toUpperCase()}` : ''} maxWidth="620px">
        {diaSeleccionado && <VerRutinaModal dia={diaSeleccionado} />}
      </Modal>

    </>
  )
}
