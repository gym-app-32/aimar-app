import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', background: '#0a0a0a' }}>
      <span style={{ fontFamily: "'Bebas Neue'", fontSize: '6rem', color: '#F5C518', lineHeight: 1 }}>404</span>
      <p style={{ color: '#888', fontFamily: 'Barlow' }}>Esta página no existe.</p>
      <button className="btn btn--outline" onClick={() => navigate('/')}>Ir al inicio</button>
    </div>
  )
}