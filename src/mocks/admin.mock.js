// ─── Especialidades ───────────────────────────────────────
export const ESPECIALIDADES = [
  { id: 1, nombre: 'Musculación',                 abreviatura: 'Musculación',  descripcion: 'Entrenamiento con pesas y máquinas.' },
  { id: 2, nombre: 'Entrenamiento Funcional',     abreviatura: 'Funcional',    descripcion: 'Entrenamiento funcional y circuitos.' },
  { id: 3, nombre: 'Boxeo',                       abreviatura: 'Boxeo',        descripcion: 'Técnica y entrenamiento de boxeo.' },
  { id: 4, nombre: 'Kickboxing Recreativo',       abreviatura: 'Kickboxing',   descripcion: 'Técnica y entrenamiento de kickboxing.' },
  { id: 5, nombre: 'Judo',                        abreviatura: 'Judo',         descripcion: 'Arte marcial y entrenamiento de judo.' },
  { id: 6, nombre: 'Masajes Deportivos',          abreviatura: 'Masajes',      descripcion: 'Masajes deportivos y recuperación.' },
  { id: 7, nombre: 'Entrenamiento Personalizado', abreviatura: 'Personal',     descripcion: 'Plan personalizado por objetivos.' },
]

// ─── Profesores ───────────────────────────────────────────
export const PROFESORES = [
  { id: 1, nombre: 'Martín Gómez',    email: 'martin@aimar.com', telefono: '221 4567890', dni: '28123456', sexo: 'M', especialidad: 'Musculación', activo: true },
  { id: 2, nombre: 'Laura Fernández', email: 'laura@aimar.com',  telefono: '221 5678901', dni: '31456789', sexo: 'F', especialidad: 'Funcional',   activo: true },
  { id: 3, nombre: 'Diego Rojas',     email: 'diego@aimar.com',  telefono: '221 6789012', dni: '29789012', sexo: 'M', especialidad: 'Boxeo',       activo: false },
  { id: 4, nombre: 'Carla Méndez',    email: 'carla@aimar.com',  telefono: '221 7890123', dni: '33012345', sexo: 'F', especialidad: 'Kickboxing',  activo: true },
]

// ─── Alumnos ──────────────────────────────────────────────
export const ALUMNOS = [
  {
    id: 1, nombre: 'Carlos Pérez',   email: 'carlos@gmail.com', telefono: '221 1234567',
    fechaNacimiento: '1995-06-15', dni: '35123456', sexo: 'M',
    actividades: [
      { especialidadId: 1, profesorId: 1 },
      { especialidadId: 4, profesorId: 4 },
    ],
    rutina: 'Fuerza + Hipertrofia', activo: true,
  },
  {
    id: 2, nombre: 'Sofía López',    email: 'sofia@gmail.com',  telefono: '221 2345678',
    fechaNacimiento: '1998-03-22', dni: '38456789', sexo: 'F',
    actividades: [{ especialidadId: 2, profesorId: 2 }],
    rutina: 'Funcional Full Body', activo: true,
  },
  {
    id: 3, nombre: 'Tomás García',   email: 'tomas@gmail.com',  telefono: '221 3456789',
    fechaNacimiento: '2000-11-08', dni: '40789012', sexo: 'M',
    actividades: [],
    rutina: 'Sin asignar', activo: false,
  },
  {
    id: 4, nombre: 'Valentina Ruiz', email: 'vale@gmail.com',   telefono: '221 4567890',
    fechaNacimiento: '1993-07-30', dni: '32345678', sexo: 'F',
    actividades: [{ especialidadId: 4, profesorId: 4 }],
    rutina: 'Kickboxing Básico', activo: true,
  },
  {
    id: 5, nombre: 'Nicolás Torres', email: 'nico@gmail.com',   telefono: '221 5678901',
    fechaNacimiento: '1997-01-14', dni: '37901234', sexo: 'M',
    actividades: [],
    rutina: 'Sin asignar', activo: true,
  },
]

// ─── Stats dashboard ──────────────────────────────────────
const hoy  = new Date()
const anio = hoy.getFullYear()
const mes  = String(hoy.getMonth() + 1).padStart(2, '0')

export const DASHBOARD_STATS = {
  alumnosActivos:        4,
  entrenamientosSemana:  127,
  fatigaPromedio:        5.8,
  sinRutina: [
    { id: 3, nombre: 'Tomás García',   profesor: 'Martín Gómez' },
    { id: 5, nombre: 'Nicolás Torres', profesor: 'Laura Fernández' },
  ],
  sinEntrenar: [
    { id: 3,  nombre: 'Tomás García',   diasSinEntrenar: 12, profesor: 'Martín Gómez' },
    { id: 5,  nombre: 'Nicolás Torres', diasSinEntrenar: 9,  profesor: 'Laura Fernández' },
  ],
}