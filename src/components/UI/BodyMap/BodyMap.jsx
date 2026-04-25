import styles from './BodyMap.module.scss'

const MUSCULOS = {
  pecho:          { label: 'Pecho' },
  hombros:        { label: 'Hombros' },
  biceps:         { label: 'Bíceps' },
  antebrazos:     { label: 'Antebrazos' },
  abdomen:        { label: 'Abdomen' },
  cuadriceps:     { label: 'Cuádriceps' },
  gemelos:        { label: 'Gemelos' },
  trapecios:      { label: 'Trapecios' },
  espalda:        { label: 'Espalda' },
  triceps:        { label: 'Tríceps' },
  gluteos:        { label: 'Glúteos' },
  isquiotibiales: { label: 'Isquiotibiales' },
}

// ─── Figura Frontal ───────────────────────────────────────
function FiguraFrontal({ seleccionados, onToggle }) {
  const a = (m) => seleccionados.includes(m)
  const cls = (m) => `${styles.zona} ${a(m) ? styles.active : ''}`

  return (
    <svg viewBox="0 0 200 480" className={styles.figura} xmlns="http://www.w3.org/2000/svg">
      {/* ── Silueta base ── */}
      <g className={styles.silueta}>
        {/* Cabeza */}
        <ellipse cx="100" cy="38" rx="28" ry="34" />
        {/* Cuello */}
        <path d="M88 68 Q100 74 112 68 L114 82 Q100 88 86 82 Z" />
        {/* Torso */}
        <path d="M62 88 Q100 80 138 88 L144 210 Q120 218 100 218 Q80 218 56 210 Z" />
        {/* Cadera */}
        <path d="M56 210 Q78 228 100 230 Q122 228 144 210 L140 250 Q120 260 100 262 Q80 260 60 250 Z" />
        {/* Brazo izq */}
        <path d="M62 90 Q44 100 38 140 Q34 170 36 200 Q44 206 52 200 Q58 170 62 140 Q72 108 80 92 Z" />
        {/* Antebrazo izq */}
        <path d="M36 202 Q32 232 34 260 Q42 266 52 260 Q58 232 54 202 Z" />
        {/* Mano izq */}
        <path d="M34 262 Q30 278 36 290 Q44 294 52 290 Q56 278 54 262 Z" />
        {/* Brazo der */}
        <path d="M138 90 Q156 100 162 140 Q166 170 164 200 Q156 206 148 200 Q142 170 138 140 Q128 108 120 92 Z" />
        {/* Antebrazo der */}
        <path d="M164 202 Q168 232 166 260 Q158 266 148 260 Q142 232 146 202 Z" />
        {/* Mano der */}
        <path d="M166 262 Q170 278 164 290 Q156 294 148 290 Q144 278 146 262 Z" />
        {/* Muslo izq */}
        <path d="M60 252 Q50 268 48 320 Q58 330 72 328 Q82 320 84 268 Q90 254 100 250 Z" />
        {/* Muslo der */}
        <path d="M140 252 Q150 268 152 320 Q142 330 128 328 Q118 320 116 268 Q110 254 100 250 Z" />
        {/* Rodilla izq */}
        <ellipse cx="62" cy="332" rx="14" ry="12" />
        {/* Rodilla der */}
        <ellipse cx="138" cy="332" rx="14" ry="12" />
        {/* Pierna izq */}
        <path d="M50 342 Q46 390 48 428 Q58 436 72 434 Q82 390 78 342 Z" />
        {/* Pierna der */}
        <path d="M150 342 Q154 390 152 428 Q142 436 128 434 Q118 390 122 342 Z" />
        {/* Pie izq */}
        <path d="M48 430 Q42 444 50 452 Q62 456 76 452 Q80 444 78 430 Z" />
        {/* Pie der */}
        <path d="M152 430 Q158 444 150 452 Q138 456 124 452 Q120 444 122 430 Z" />
      </g>

      {/* ── Zonas musculares ── */}

      {/* Hombro izq */}
      <ellipse cx="64" cy="96" rx="18" ry="14"
        className={cls('hombros')} onClick={() => onToggle('hombros')} />
      {/* Hombro der */}
      <ellipse cx="136" cy="96" rx="18" ry="14"
        className={cls('hombros')} onClick={() => onToggle('hombros')} />

      {/* Pecho */}
      <path d="M80 94 Q100 88 120 94 L122 130 Q100 138 78 130 Z"
        className={cls('pecho')} onClick={() => onToggle('pecho')} />

      {/* Abdomen */}
      <path d="M80 132 Q100 126 120 132 L118 200 Q100 208 82 200 Z"
        className={cls('abdomen')} onClick={() => onToggle('abdomen')} />

      {/* Bíceps izq */}
      <path d="M46 100 Q36 116 36 148 Q46 154 58 148 Q64 116 74 100 Z"
        className={cls('biceps')} onClick={() => onToggle('biceps')} />
      {/* Bíceps der */}
      <path d="M154 100 Q164 116 164 148 Q154 154 142 148 Q136 116 126 100 Z"
        className={cls('biceps')} onClick={() => onToggle('biceps')} />

      {/* Antebrazo izq */}
      <path d="M36 152 Q30 184 32 214 Q42 220 54 214 Q58 184 58 152 Z"
        className={cls('antebrazos')} onClick={() => onToggle('antebrazos')} />
      {/* Antebrazo der */}
      <path d="M164 152 Q170 184 168 214 Q158 220 146 214 Q142 184 142 152 Z"
        className={cls('antebrazos')} onClick={() => onToggle('antebrazos')} />

      {/* Cuádriceps izq */}
      <path d="M62 256 Q50 272 50 318 Q62 328 76 322 Q84 272 94 256 Z"
        className={cls('cuadriceps')} onClick={() => onToggle('cuadriceps')} />
      {/* Cuádriceps der */}
      <path d="M138 256 Q150 272 150 318 Q138 328 124 322 Q116 272 106 256 Z"
        className={cls('cuadriceps')} onClick={() => onToggle('cuadriceps')} />

      {/* Gemelos izq */}
      <path d="M50 346 Q46 386 48 420 Q58 430 72 426 Q80 386 76 346 Z"
        className={cls('gemelos')} onClick={() => onToggle('gemelos')} />
      {/* Gemelos der */}
      <path d="M150 346 Q154 386 152 420 Q142 430 128 426 Q120 386 124 346 Z"
        className={cls('gemelos')} onClick={() => onToggle('gemelos')} />

      {/* Labels */}
      <text x="100" y="116" textAnchor="middle"
        className={`${styles.lbl} ${a('pecho') ? styles.lblActive : ''}`}>Pecho</text>
      <text x="100" y="166" textAnchor="middle"
        className={`${styles.lbl} ${a('abdomen') ? styles.lblActive : ''}`}>Abdomen</text>
      <text x="44" y="130" textAnchor="middle"
        className={`${styles.lbl} ${a('biceps') ? styles.lblActive : ''}`}>Bíc.</text>
      <text x="156" y="130" textAnchor="middle"
        className={`${styles.lbl} ${a('biceps') ? styles.lblActive : ''}`}>Bíc.</text>
      <text x="72" y="292" textAnchor="middle"
        className={`${styles.lbl} ${a('cuadriceps') ? styles.lblActive : ''}`}>Cuád.</text>
      <text x="128" y="292" textAnchor="middle"
        className={`${styles.lbl} ${a('cuadriceps') ? styles.lblActive : ''}`}>Cuád.</text>
    </svg>
  )
}

// ─── Figura Trasera ───────────────────────────────────────
function FiguraTrasera({ seleccionados, onToggle }) {
  const a = (m) => seleccionados.includes(m)
  const cls = (m) => `${styles.zona} ${a(m) ? styles.active : ''}`

  return (
    <svg viewBox="0 0 200 480" className={styles.figura} xmlns="http://www.w3.org/2000/svg">
      {/* ── Silueta base ── */}
      <g className={styles.silueta}>
        <ellipse cx="100" cy="38" rx="28" ry="34" />
        <path d="M88 68 Q100 74 112 68 L114 82 Q100 88 86 82 Z" />
        <path d="M62 88 Q100 80 138 88 L144 210 Q120 218 100 218 Q80 218 56 210 Z" />
        <path d="M56 210 Q78 228 100 230 Q122 228 144 210 L140 250 Q120 260 100 262 Q80 260 60 250 Z" />
        <path d="M62 90 Q44 100 38 140 Q34 170 36 200 Q44 206 52 200 Q58 170 62 140 Q72 108 80 92 Z" />
        <path d="M36 202 Q32 232 34 260 Q42 266 52 260 Q58 232 54 202 Z" />
        <path d="M34 262 Q30 278 36 290 Q44 294 52 290 Q56 278 54 262 Z" />
        <path d="M138 90 Q156 100 162 140 Q166 170 164 200 Q156 206 148 200 Q142 170 138 140 Q128 108 120 92 Z" />
        <path d="M164 202 Q168 232 166 260 Q158 266 148 260 Q142 232 146 202 Z" />
        <path d="M166 262 Q170 278 164 290 Q156 294 148 290 Q144 278 146 262 Z" />
        <path d="M60 252 Q50 268 48 320 Q58 330 72 328 Q82 320 84 268 Q90 254 100 250 Z" />
        <path d="M140 252 Q150 268 152 320 Q142 330 128 328 Q118 320 116 268 Q110 254 100 250 Z" />
        <ellipse cx="62" cy="332" rx="14" ry="12" />
        <ellipse cx="138" cy="332" rx="14" ry="12" />
        <path d="M50 342 Q46 390 48 428 Q58 436 72 434 Q82 390 78 342 Z" />
        <path d="M150 342 Q154 390 152 428 Q142 436 128 434 Q118 390 122 342 Z" />
        <path d="M48 430 Q42 444 50 452 Q62 456 76 452 Q80 444 78 430 Z" />
        <path d="M152 430 Q158 444 150 452 Q138 456 124 452 Q120 444 122 430 Z" />
      </g>

      {/* ── Zonas musculares ── */}

      {/* Trapecios */}
      <path d="M82 72 Q100 64 118 72 L126 90 Q100 98 74 90 Z"
        className={cls('trapecios')} onClick={() => onToggle('trapecios')} />

      {/* Hombro izq */}
      <ellipse cx="64" cy="96" rx="18" ry="14"
        className={cls('hombros')} onClick={() => onToggle('hombros')} />
      {/* Hombro der */}
      <ellipse cx="136" cy="96" rx="18" ry="14"
        className={cls('hombros')} onClick={() => onToggle('hombros')} />

      {/* Espalda alta + lumbar */}
      <path d="M78 96 Q100 90 122 96 L122 200 Q100 208 78 200 Z"
        className={cls('espalda')} onClick={() => onToggle('espalda')} />

      {/* Tríceps izq */}
      <path d="M46 100 Q36 116 36 148 Q46 154 58 148 Q64 116 74 100 Z"
        className={cls('triceps')} onClick={() => onToggle('triceps')} />
      {/* Tríceps der */}
      <path d="M154 100 Q164 116 164 148 Q154 154 142 148 Q136 116 126 100 Z"
        className={cls('triceps')} onClick={() => onToggle('triceps')} />

      {/* Antebrazo izq */}
      <path d="M36 152 Q30 184 32 214 Q42 220 54 214 Q58 184 58 152 Z"
        className={cls('antebrazos')} onClick={() => onToggle('antebrazos')} />
      {/* Antebrazo der */}
      <path d="M164 152 Q170 184 168 214 Q158 220 146 214 Q142 184 142 152 Z"
        className={cls('antebrazos')} onClick={() => onToggle('antebrazos')} />

      {/* Glúteos */}
      <path d="M62 214 Q56 230 56 252 Q78 264 100 264 Q122 264 144 252 Q144 230 138 214 Q120 222 100 222 Q80 222 62 214 Z"
        className={cls('gluteos')} onClick={() => onToggle('gluteos')} />

      {/* Isquiotibiales izq */}
      <path d="M60 256 Q50 274 50 318 Q62 328 76 322 Q84 274 90 256 Z"
        className={cls('isquiotibiales')} onClick={() => onToggle('isquiotibiales')} />
      {/* Isquiotibiales der */}
      <path d="M140 256 Q150 274 150 318 Q138 328 124 322 Q116 274 110 256 Z"
        className={cls('isquiotibiales')} onClick={() => onToggle('isquiotibiales')} />

      {/* Gemelos izq */}
      <path d="M50 346 Q46 386 48 420 Q58 430 72 426 Q80 386 76 346 Z"
        className={cls('gemelos')} onClick={() => onToggle('gemelos')} />
      {/* Gemelos der */}
      <path d="M150 346 Q154 386 152 420 Q142 430 128 426 Q120 386 124 346 Z"
        className={cls('gemelos')} onClick={() => onToggle('gemelos')} />

      {/* Labels */}
      <text x="100" y="82" textAnchor="middle"
        className={`${styles.lbl} ${a('trapecios') ? styles.lblActive : ''}`}>Trap.</text>
      <text x="100" y="150" textAnchor="middle"
        className={`${styles.lbl} ${a('espalda') ? styles.lblActive : ''}`}>Espalda</text>
      <text x="44" y="130" textAnchor="middle"
        className={`${styles.lbl} ${a('triceps') ? styles.lblActive : ''}`}>Trí.</text>
      <text x="156" y="130" textAnchor="middle"
        className={`${styles.lbl} ${a('triceps') ? styles.lblActive : ''}`}>Trí.</text>
      <text x="100" y="244" textAnchor="middle"
        className={`${styles.lbl} ${a('gluteos') ? styles.lblActive : ''}`}>Glúteos</text>
      <text x="62" y="292" textAnchor="middle"
        className={`${styles.lbl} ${a('isquiotibiales') ? styles.lblActive : ''}`}>Isq.</text>
      <text x="138" y="292" textAnchor="middle"
        className={`${styles.lbl} ${a('isquiotibiales') ? styles.lblActive : ''}`}>Isq.</text>
    </svg>
  )
}

// ─── Componente principal ─────────────────────────────────
export default function BodyMap({ seleccionados = [], onChange }) {
  const toggle = (musculo) => {
    if (seleccionados.includes(musculo)) {
      onChange(seleccionados.filter(m => m !== musculo))
    } else {
      onChange([...seleccionados, musculo])
    }
  }

  return (
    <div className={styles.bodyMap}>
      <div className={styles.figuras}>
        <div className={styles.figuraWrapper}>
          <span className={styles.figuraLabel}>Frontal</span>
          <FiguraFrontal seleccionados={seleccionados} onToggle={toggle} />
        </div>
        <div className={styles.figuraWrapper}>
          <span className={styles.figuraLabel}>Trasero</span>
          <FiguraTrasera seleccionados={seleccionados} onToggle={toggle} />
        </div>
      </div>

      {seleccionados.length > 0 ? (
        <div className={styles.seleccionados}>
          {seleccionados.map(m => (
            <button
              key={m}
              className={styles.musculoTag}
              onClick={() => toggle(m)}
            >
              {MUSCULOS[m]?.label} ✕
            </button>
          ))}
        </div>
      ) : (
        <p className={styles.hint}>Tocá los músculos que sentís fatigados</p>
      )}
    </div>
  )
}