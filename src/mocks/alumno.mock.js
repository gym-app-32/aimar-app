// ─── Usuario alumno logueado ───────────────────────────────
export const ALUMNO = {
  id: 1,
  nombre: 'Mauro Mattioli',
  email: 'alumno@aimar.com',
  telefono: '2314 443314',
  fechaNacimiento: '1989-08-20',
  foto: null,
  rol: 'alumno',
  profesorId: 1,
  clasesInscripto: ['musculacion','kickboxing'],
}

// ─── Rutina asignada ──────────────────────────────────────
export const RUTINA_ACTIVA = {
  id: 1,
  nombre: 'Fuerza + Hipertrofia',
  inicio: '2026-04-01',
  semanas: 6,
  semanaActual: 4,
  alumnoId: 1,
  profesorId: 1,
  dias: [
    {
      id: 1,
      nombre: 'Piernas',
      gruposMusculares: 'Cuádriceps, Glúteos, Isquiotibiales',
      precalentamiento: {
        repeticionesSerie: 1,
        descanso: 0,
        ejercicios: [
          {
            id: 1,
            nombre: 'Bicicleta estática',
            reps: ['10 min'],
            descripcion: 'Calentamiento cardiovascular suave.',
            video: '',
            utilitarios: [{ nombre: 'Bicicleta', foto: null }],
          },
          {
            id: 2,
            nombre: 'Salto a la soga',
            reps: ['5 min'],
            descripcion: 'Activación cardiovascular.',
            video: '',
            utilitarios: [{ nombre: 'Soga', foto: null }],
          },
        ],
      },
      series: [
        {
          id: 1,
          repeticionesSerie: 4,
          descanso: 10,
          ejercicios: [
            {
              id: 3,
              nombre: 'Sentadilla con barra',
              reps: [8, 8, 7, 6],
              descripcion: 'Ejercicio compuesto para piernas y glúteos.',
              video: 'https://youtube.com',
              utilitarios: [
                { nombre: 'Barra olímpica', foto: null },
                { nombre: 'Rack', foto: null },
              ],
            },
            {
              id: 4,
              nombre: 'Prensa de piernas',
              reps: [12, 12, 10, 10],
              descripcion: 'Máquina para cuádriceps.',
              video: '',
              utilitarios: [{ nombre: 'Prensa', foto: null }],
            },
          ],
        },
        {
          id: 2,
          repeticionesSerie: 3,
          descanso: 8,
          ejercicios: [
            {
              id: 5,
              nombre: 'Curl femoral',
              reps: [12, 12, 12],
              descripcion: 'Isquiotibiales en máquina.',
              video: '',
              utilitarios: [{ nombre: 'Máquina curl', foto: null }],
            },
            {
              id: 6,
              nombre: 'Extensión de pierna',
              reps: [15, 15, 12],
              descripcion: 'Cuádriceps en máquina.',
              video: '',
              utilitarios: [{ nombre: 'Máquina extensión', foto: null }],
            },
          ],
        },
      ],
      postentrenamiento: {
        repeticionesSerie: 1,
        descanso: 0,
        ejercicios: [
          {
            id: 7,
            nombre: 'Estiramiento cuádriceps',
            reps: ['2 min'],
            descripcion: 'Estiramiento estático.',
            video: '',
            utilitarios: [],
          },
          {
            id: 8,
            nombre: 'Estiramiento isquios',
            reps: ['2 min'],
            descripcion: 'Estiramiento isquiotibiales.',
            video: '',
            utilitarios: [],
          },
        ],
      },
    },
    {
      id: 2,
      nombre: 'Empuje',
      gruposMusculares: 'Pecho, Hombros, Tríceps',
      precalentamiento: {
        repeticionesSerie: 1,
        descanso: 0,
        ejercicios: [
          {
            id: 9,
            nombre: 'Soga de saltar',
            reps: ['5 min'],
            descripcion: 'Activación cardiovascular.',
            video: '',
            utilitarios: [{ nombre: 'Soga', foto: null }],
          },
        ],
      },
      series: [
        {
          id: 3,
          repeticionesSerie: 4,
          descanso: 10,
          ejercicios: [
            {
              id: 10,
              nombre: 'Press de banca',
              reps: [8, 8, 7, 6],
              descripcion: 'Pecho y tríceps.',
              video: 'https://youtube.com',
              utilitarios: [
                { nombre: 'Barra olímpica', foto: null },
                { nombre: 'Banco plano', foto: null },
              ],
            },
            {
              id: 11,
              nombre: 'Press militar',
              reps: [10, 10, 8, 8],
              descripcion: 'Hombros con barra.',
              video: '',
              utilitarios: [{ nombre: 'Barra olímpica', foto: null }],
            },
          ],
        },
        {
          id: 4,
          repeticionesSerie: 3,
          descanso: 8,
          ejercicios: [
            {
              id: 12,
              nombre: 'Extensión tríceps',
              reps: [12, 12, 12],
              descripcion: 'Aislamiento tríceps.',
              video: '',
              utilitarios: [{ nombre: 'Polea alta', foto: null }],
            },
          ],
        },
      ],
      postentrenamiento: {
        repeticionesSerie: 1,
        descanso: 0,
        ejercicios: [
          {
            id: 13,
            nombre: 'Estiramiento pecho',
            reps: ['2 min'],
            descripcion: 'Estiramiento pecho.',
            video: '',
            utilitarios: [],
          },
        ],
      },
    },
    {
      id: 3,
      nombre: 'Tirón',
      gruposMusculares: 'Espalda, Bíceps, Trapecios',
      precalentamiento: {
        repeticionesSerie: 1,
        descanso: 0,
        ejercicios: [
          {
            id: 14,
            nombre: 'Bicicleta estática',
            reps: ['8 min'],
            descripcion: 'Calentamiento.',
            video: '',
            utilitarios: [{ nombre: 'Bicicleta', foto: null }],
          },
        ],
      },
      series: [
        {
          id: 5,
          repeticionesSerie: 4,
          descanso: 10,
          ejercicios: [
            {
              id: 15,
              nombre: 'Remo con barra',
              reps: [8, 8, 8, 6],
              descripcion: 'Espalda y bíceps.',
              video: 'https://youtube.com',
              utilitarios: [{ nombre: 'Barra olímpica', foto: null }],
            },
            {
              id: 16,
              nombre: 'Jalón al pecho',
              reps: [10, 10, 10, 8],
              descripcion: 'Dorsal con polea.',
              video: '',
              utilitarios: [{ nombre: 'Polea alta', foto: null }],
            },
          ],
        },
        {
          id: 6,
          repeticionesSerie: 3,
          descanso: 8,
          ejercicios: [
            {
              id: 17,
              nombre: 'Curl de bíceps',
              reps: [12, 12, 10],
              descripcion: 'Aislamiento bíceps.',
              video: '',
              utilitarios: [{ nombre: 'Mancuernas', foto: null }],
            },
          ],
        },
      ],
      postentrenamiento: {
        repeticionesSerie: 1,
        descanso: 0,
        ejercicios: [
          {
            id: 18,
            nombre: 'Estiramiento espalda',
            reps: ['2 min'],
            descripcion: 'Estiramiento espalda.',
            video: '',
            utilitarios: [],
          },
        ],
      },
    },
  ],
}

// ─── Clases disponibles ───────────────────────────────────
export const CLASES = [
  { id: 'kickboxing', nombre: 'Kickboxing', horario: 'Lun/Jue 21:00hs',     habilitada: true },
  //{ id: 'funcional',  nombre: 'Funcional',             horario: 'Lun/Mié/Vie 19:00hs', habilitada: false },
  //{ id: 'gap',        nombre: 'GAP',                   horario: 'Mar/Jue 15:00hs',      habilitada: false },
]

// ─── Historial de entrenamientos ──────────────────────────
const hoy  = new Date()
const anio = hoy.getFullYear()
const mes  = String(hoy.getMonth() + 1).padStart(2, '0')

export const HISTORIAL = [
  {
    id: 1,
    fecha: `${anio}-${mes}-20`,
    hora: '19:30',
    tipo: 'rutina',
    nombre: 'Día 1 — Piernas',
    rutina: 'Fuerza + Hipertrofia',
    duracion: 55,
    ejercicios: [
      { nombre: 'Sentadilla con barra', series: [{ reps: [8, 8, 7, 6] }] },
      { nombre: 'Prensa de piernas',    series: [{ reps: [12, 12, 10, 10] }] },
    ],
    fatiga: { cansancio: 7, dolorMuscular: 6, sueno: 4 },
  },
  {
    id: 2,
    fecha: `${anio}-${mes}-20`,
    hora: '21:00',
    tipo: 'clase',
    nombre: 'Kickboxing Recreativo',
    rutina: null,
    duracion: 60,
    ejercicios: [],
    fatiga: { cansancio: 8, dolorMuscular: 5, sueno: 4 },
  },
  {
    id: 3,
    fecha: `${anio}-${mes}-18`,
    hora: '19:15',
    tipo: 'rutina',
    nombre: 'Día 2 — Empuje',
    rutina: 'Fuerza + Hipertrofia',
    duracion: 50,
    ejercicios: [
      { nombre: 'Press de banca', series: [{ reps: [8, 8, 7, 6] }] },
      { nombre: 'Press militar',  series: [{ reps: [10, 10, 8, 8] }] },
    ],
    fatiga: { cansancio: 5, dolorMuscular: 4, sueno: 7 },
  },
  {
    id: 4,
    fecha: `${anio}-${mes}-16`,
    hora: '19:00',
    tipo: 'rutina',
    nombre: 'Día 3 — Tirón',
    rutina: 'Fuerza + Hipertrofia',
    duracion: 52,
    ejercicios: [
      { nombre: 'Remo con barra', series: [{ reps: [8, 8, 8, 6] }] },
      { nombre: 'Curl de bíceps', series: [{ reps: [12, 12, 10] }] },
    ],
    fatiga: { cansancio: 4, dolorMuscular: 3, sueno: 8 },
  },
  {
    id: 5,
    fecha: `${anio}-${mes}-14`,
    hora: '21:00',
    tipo: 'clase',
    nombre: 'Kickboxing Recreativo',
    rutina: null,
    duracion: 60,
    ejercicios: [],
    fatiga: { cansancio: 6, dolorMuscular: 4, sueno: 6 },
  },
  {
    id: 6,
    fecha: `${anio}-${mes}-10`,
    hora: '19:30',
    tipo: 'rutina',
    nombre: 'Día 1 — Piernas',
    rutina: 'Fuerza + Hipertrofia',
    duracion: 58,
    ejercicios: [
      { nombre: 'Sentadilla con barra', series: [{ reps: [8, 8, 8, 7] }] },
    ],
    fatiga: { cansancio: 6, dolorMuscular: 7, sueno: 5 },
  },
]

// Mapa rápido fecha → entrenamiento (para el calendario)
export const HISTORIAL_POR_FECHA = HISTORIAL.reduce((acc, e) => {
  if (!acc[e.fecha]) acc[e.fecha] = []
  acc[e.fecha].push(e)
  return acc
}, {})

// ─── Encuestas pendientes ─────────────────────────────────
export const ENCUESTAS_PENDIENTES = [
  { id: 1, entrenamientoId: 1, tipo: 'rutina', nombre: 'Día 1 — Piernas', hora: '19:30', completada: false },
  { id: 2, entrenamientoId: 2, tipo: 'clase',  nombre: 'Kickboxing Recreativo', hora: '21:00', completada: true },
]