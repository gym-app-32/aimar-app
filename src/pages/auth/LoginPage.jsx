import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

import Logo from '../../components/Logos/Logo'
import styles from './LoginPage.module.scss'
import { ThreeArrows } from '../../components/Icons/Icons'

// Mock temporal hasta tener el backend
const MOCK_USERS = [
  { id: 1, name: 'Carlos Pérez', email: 'alumno@aimar.com', password: '123456', role: 'alumno' },
  { id: 2, name: 'Martín Gómez', email: 'profesor@aimar.com', password: '123456', role: 'profesor' },
  { id: 3, name: 'Admin Aimar', email: 'admin@aimar.com', password: '123456', role: 'admin' },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Mock login — reemplazar por api.post('/auth/login') cuando haya backend
    await new Promise(r => setTimeout(r, 600))
    const user = MOCK_USERS.find(
      u => u.email === form.email && u.password === form.password
    )

    if (!user) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    const { password, ...safeUser } = user
    login('mock-token-123', safeUser)

    if (safeUser.role === 'alumno') navigate('/alumno')
    if (safeUser.role === 'profesor') navigate('/profesor')
    if (safeUser.role === 'admin') navigate('/admin')
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            <Logo />
          </span>
          <p className={styles.tagline}>Si hay determinación, no hay límites.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <h1 className={styles.title}>ACCEDER</h1>

          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu-usuario@aimar.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.containerButtonArrows}>
            <ThreeArrows  />
            <button
              type="submit"
              className="btn btn--primary btn--full btn--lg"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
            <ThreeArrows  className={styles.right}/>
          </div>

        </form>

        <div className={styles.hint}>
          <p>Usuarios de prueba:</p>
          <p>alumno@aimar.com / 123456</p>
          <p>profesor@aimar.com / 123456</p>
          <p>admin@aimar.com / 123456</p>
        </div>
      </div>
    </div>
  )
}