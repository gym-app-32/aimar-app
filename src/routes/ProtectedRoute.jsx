import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div>Cargando...</div>
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export function RoleRoute({ roles }) {
  const { isAuthenticated, role, loading } = useAuth()
  if (loading) return <div>Cargando...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!roles.includes(role)) return <Navigate to="/unauthorized" replace />
  return <Outlet />
}