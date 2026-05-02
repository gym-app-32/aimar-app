import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from './PerfilPage.module.scss'

const MOCK_PERFIL = {
  nombre: 'Carlos Pérez',
  email: 'alumno@aimar.com',
  telefono: '221 4567890',
  fechaNacimiento: '1995-06-15',
  dni: '35123456',
  sexo: 'M',
  foto: null,
}

export default function PerfilPage() {
  const { user, login } = useAuth()
  const [form, setForm] = useState(MOCK_PERFIL)
  const [preview, setPreview] = useState(null)
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const fileRef = useRef()

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setGuardado(false)
  }

  const handleFoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(file)
    setGuardado(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    // await api.put('/perfil', { ...form, foto: preview })
    await new Promise(r => setTimeout(r, 800))
    setGuardando(false)
    setGuardado(true)
    setEditando(false)
  }

  const handleCancelar = () => {
    setForm(MOCK_PERFIL)
    setPreview(null)
    setEditando(false)
    setGuardado(false)
  }

  const iniciales = form.nombre
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className={styles.page}>
      <div className="page-header">
        <h1>MI <span>PERFIL</span></h1>
        <p>Tus datos personales.</p>
      </div>

      <div className={styles.container}>

        {/* Foto */}
        <div className={`card ${styles.fotoCard}`}>
          <div
            className={styles.avatar}
            onClick={() => editando && fileRef.current.click()}
            style={{ cursor: editando ? 'pointer' : 'default' }}
          >
            {preview ? (
              <img src={preview} alt="Foto de perfil" className={styles.avatarImg} />
            ) : (
              <span className={styles.avatarInitials}>{iniciales}</span>
            )}
            {editando && (
              <div className={styles.avatarOverlay}>
                <span>📷</span>
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFoto}
            style={{ display: 'none' }}
          />

          <span className={styles.nombreDisplay}>{form.nombre}</span>
          <span className={`badge badge--gold ${styles.roleBadge}`}>{user?.role}</span>

          {!editando && (
            <button
              className="btn btn--outline btn--full"
              onClick={() => setEditando(true)}
            >
              Editar perfil
            </button>
          )}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className={`card ${styles.formCard}`}>
          <h2 className={styles.formTitle}>DATOS PERSONALES</h2>

          <div className={styles.fields}>
            <div className={styles.field}>
              <label>Nombre completo</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                disabled={!editando}
                placeholder="Tu nombre"
              />
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!editando}
                placeholder="tu@email.com"
              />
            </div>

            <div className={styles.field}>
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                disabled={!editando}
                placeholder="221 0000000"
              />
            </div>

            <div className={styles.field}>
              <label>Fecha de nacimiento</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={form.fechaNacimiento}
                onChange={handleChange}
                disabled={!editando}
              />
            </div>
            <div className={styles.field}>
            <label>DNI</label>
            <input
              type="text"
              name="dni"
              value={form.dni}
              onChange={handleChange}
              disabled={!editando}
              placeholder="Ej: 35123456"
            />
          </div>

          <div className={styles.field}>
            <label>Sexo</label>
            <select
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              disabled={!editando}
            >
              <option value="">Seleccioná</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="X">No decide</option>
            </select>
          </div>
          </div>
          

          {editando && (
            <div className={styles.actions}>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={guardando}
              >
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          )}

          {guardado && (
            <p className={styles.successMsg}>✓ Cambios guardados correctamente</p>
          )}
        </form>

      </div>
    </div>
  )
}