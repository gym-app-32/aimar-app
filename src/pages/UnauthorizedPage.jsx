import { useNavigate } from 'react-router-dom'

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', background: '#0a0a0a' }}>
      <span style={{ fontFamily: "'Bebas Neue'", fontSize: '6rem', color: '#F5C518', lineHeight: 1 }}>403</span>
      <p style={{ color: '#888', fontFamily: 'Barlow' }}>No tenés permisos para acceder a esta sección.</p>
      <button className="btn btn--outline" onClick={() => navigate(-1)}>Volver</button>
    </div>
  )
}