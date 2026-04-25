import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { RoleRoute } from './ProtectedRoute'

import LoginPage from '../pages/auth/LoginPage'
import UnauthorizedPage from '../pages/UnauthorizedPage'
import NotFoundPage from '../pages/NotFoundPage'

import AppLayout from '../components/AppLayout'

import AlumnoDashboard from '../pages/alumno/AlumnoDashboard'
import AlumnoHistorial from '../pages/alumno/AlumnoHistorial'
import AlumnoEncuesta from '../pages/alumno/AlumnoEncuesta'

import ProfesorDashboard from '../pages/profesor/ProfesorDashboard'
import ProfesorAlumnos from '../pages/profesor/ProfesorAlumnos'
import ProfesorEjercicios from '../pages/profesor/ProfesorEjercicios'

import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminProfesores from '../pages/admin/AdminProfesores'
import AdminAlumnos from '../pages/admin/AdminAlumnos'

import PerfilPage from '../pages/perfil/PerfilPage'

function RootRedirect() {
  const { role, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role === 'alumno')   return <Navigate to="/alumno" replace />
  if (role === 'profesor') return <Navigate to="/profesor" replace />
  if (role === 'admin')    return <Navigate to="/admin" replace />
  return <Navigate to="/login" replace />
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/aimar-app" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/" element={<RootRedirect />} />

        {/* Alumno */}
        <Route element={<RoleRoute roles={['alumno']} />}>
          <Route element={<AppLayout />}>
            <Route path="/alumno" element={<AlumnoDashboard />} />
            <Route path="/alumno/historial" element={<AlumnoHistorial />} />
            <Route path="/alumno/encuesta" element={<AlumnoEncuesta />} />
            <Route path="/alumno/perfil" element={<PerfilPage />} />
          </Route>
        </Route>

        {/* Profesor */}
        <Route element={<RoleRoute roles={['profesor']} />}>
          <Route element={<AppLayout />}>
            <Route path="/profesor" element={<ProfesorDashboard />} />
            <Route path="/profesor/alumnos" element={<ProfesorAlumnos />} />
            <Route path="/profesor/ejercicios" element={<ProfesorEjercicios />} />
            <Route path="/profesor/perfil" element={<PerfilPage />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<RoleRoute roles={['admin']} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/usuarios" element={<AdminProfesores />} />
            <Route path="/admin/alumnos" element={<AdminAlumnos />} />
            <Route path="/admin/perfil" element={<PerfilPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}