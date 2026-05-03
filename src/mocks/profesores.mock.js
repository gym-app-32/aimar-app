// ─── Alumnos del profesor ─────────────────────────────────
export const MIS_ALUMNOS = [
  {
    id: 1, nombre: 'Carlos Pérez',   email: 'carlos@gmail.com', telefono: '221 1234567',
    fechaNacimiento: '1995-06-15', dni: '35123456', sexo: 'M',
    rutina: 'Fuerza + Hipertrofia',
    ultimoEntrenamiento: '2026-04-20', fatigaPromedio: 6.2, activo: true,
  },
  {
    id: 2, nombre: 'Sofía López',    email: 'sofia@gmail.com',  telefono: '221 2345678',
    fechaNacimiento: '1998-03-22', dni: '38456789', sexo: 'F',
    rutina: 'Funcional Full Body',
    ultimoEntrenamiento: '2026-04-18', fatigaPromedio: 4.8, activo: true,
  },
  {
    id: 3, nombre: 'Tomás García',   email: 'tomas@gmail.com',  telefono: '221 3456789',
    fechaNacimiento: '2000-11-08', dni: '40789012', sexo: 'M',
    rutina: 'Sin asignar',
    ultimoEntrenamiento: '2026-04-10', fatigaPromedio: 7.5, activo: false,
  },
  {
    id: 4, nombre: 'Valentina Ruiz', email: 'vale@gmail.com',   telefono: '221 4567890',
    fechaNacimiento: '1993-07-30', dni: '32345678', sexo: 'F',
    rutina: 'Kickboxing Básico',
    ultimoEntrenamiento: '2026-04-20', fatigaPromedio: 3.9, activo: true,
  },
  {
    id: 5, nombre: 'Nicolás Torres', email: 'nico@gmail.com',   telefono: '221 5678901',
    fechaNacimiento: '1997-01-14', dni: '37901234', sexo: 'M',
    rutina: 'Sin asignar',
    ultimoEntrenamiento: '2026-04-08', fatigaPromedio: 8.1, activo: true,
  },
]

// ─── Utilitarios ──────────────────────────────────────────
export const UTILITARIOS = [
  { id: 1, nombre: 'Barra olímpica', descripcion: 'Barra de 20kg para ejercicios compuestos.', imagen: null },
  { id: 2, nombre: 'Mancuernas',     descripcion: 'Par de mancuernas ajustables de 2 a 40kg.', imagen: null },
  { id: 3, nombre: 'Soga de saltar', descripcion: 'Soga para calentamiento y cardio.',          imagen: null },
  { id: 4, nombre: 'Press de banca', descripcion: 'Banco regulable para press.',                imagen: null },
  { id: 5, nombre: 'Polea alta',     descripcion: 'Máquina de polea para jalones y tríceps.',   imagen: null },
  { id: 6, nombre: 'Kettlebell',     descripcion: 'Pesas rusas para funcional.',                imagen: null },
]

// ─── Ejercicios ───────────────────────────────────────────
export const EJERCICIOS = [
  { id: 1, nombre: 'Sentadilla con barra', descripcion: 'Ejercicio compuesto para piernas y glúteos.', video: '', utilitarios: [1, 4], imagen: null },
  { id: 2, nombre: 'Press de banca',       descripcion: 'Ejercicio de empuje para pecho y tríceps.',   video: '', utilitarios: [1, 4], imagen: null },
  { id: 3, nombre: 'Remo con barra',       descripcion: 'Ejercicio de tirón para espalda y bíceps.',   video: '', utilitarios: [1],    imagen: null },
  { id: 4, nombre: 'Curl de bíceps',       descripcion: 'Ejercicio de aislamiento para bíceps.',       video: '', utilitarios: [2],    imagen: null },
  { id: 5, nombre: 'Salto a la soga',      descripcion: 'Ejercicio cardiovascular de calentamiento.',  video: '', utilitarios: [3],    imagen: null },
]

// ─── Rutinas ──────────────────────────────────────────────
export const RUTINAS = [
  { id: 1, nombre: 'Fuerza + Hipertrofia', alumnoId: 1, inicio: '2026-04-01', semanas: 6, dias: [] },
  { id: 2, nombre: 'Funcional Full Body',  alumnoId: 2, inicio: '2026-04-06', semanas: 4, dias: [] },
  { id: 3, nombre: 'Kickboxing Básico',    alumnoId: 4, inicio: '2026-04-10', semanas: 6, dias: [] },
]