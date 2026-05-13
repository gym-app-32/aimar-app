import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = useCallback((token, user) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  // Helper: chequea un permiso puntual del profesor logueado
  // Ej: puedeHacer('alumnos', 'editar')
  const puedeHacer = useCallback((seccion, accion) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permisos?.[seccion]?.[accion] === true
  }, [user])

  const value = {
    user,
    loading,
    login,
    logout,
    puedeHacer,
    isAuthenticated: !!user,
    role: user?.role || null,
    isAlumno:   user?.role === 'alumno',
    isProfesor: user?.role === 'profesor',
    isAdmin:    user?.role === 'admin',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}