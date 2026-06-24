import { useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const navigate = useNavigate()

  // Protect the page — redirect if not logged in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/sign-in' })
    }
  }, [isLoading, isAuthenticated, navigate])

  if (isLoading || !user) return null

  function handleLogout() {
    logout()
    navigate({ to: '/sign-in' })
  }

  const initials = user.fullname
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div style={s.page}>
      {/* Header bar */}
      <div style={s.topbar}>
        <Link to="/" style={s.brand}>ART STUDIO</Link>
        <button onClick={handleLogout} style={s.logoutBtn}>Sign Out</button>
      </div>

      <div style={s.body}>
        {/* Welcome card */}
        <div style={s.welcomeCard}>
          <div style={s.avatar}>{initials}</div>
          <div>
            <h1 style={s.welcome}>Welcome, {user.fullname.split(' ')[0]} 👋</h1>
            <p style={s.subtitle}>You are signed in to ART STUDIO</p>
          </div>
        </div>

        {/* Info grid */}
        <div style={s.grid}>
          <InfoCard label="Full Name" value={user.fullname} />
          <InfoCard label="Email Address" value={user.email} />
          <InfoCard
            label="Account Role"
            value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            highlight={user.role === 'admin'}
          />
          <InfoCard label="Session" value="Active" highlight />
        </div>

        {/* Role-based section */}
        {user.role === 'admin' ? (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Admin Controls</h2>
            <p style={s.sectionText}>
              You have administrator access. Manage products, view orders, and control user accounts from the admin dashboard.
            </p>
            <Link to="/admin" style={s.actionBtn}>Go to Admin Dashboard →</Link>
          </div>
        ) : (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Your Account</h2>
            <p style={s.sectionText}>
              Browse our collection, add artworks to your cart, and complete purchases securely.
            </p>
            <Link to="/" style={s.actionBtn}>Browse Artworks →</Link>
          </div>
        )}

        {/* Session info box */}
        <div style={s.sessionBox}>
          <p style={s.sessionNote}>
            🔒 Your session is protected with a JSON Web Token (JWT). This token is stored securely
            and sent with every request to verify your identity without exposing your password.
          </p>
        </div>
      </div>
    </div>
  )
}

function InfoCard({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div style={s.card}>
      <span style={s.cardLabel}>{label}</span>
      <span style={{ ...s.cardValue, color: highlight ? '#c6f135' : '#ffffff' }}>{value}</span>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at 50% 0%, #1a2a1a 0%, #0d1a12 30%, #0a0a0a 70%, #000 100%)',
    fontFamily: 'Inter, system-ui, sans-serif',
    color: '#fff',
  },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  brand: {
    fontSize: '15px',
    fontWeight: 700,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: '#fff',
    textDecoration: 'none',
  },
  logoutBtn: {
    padding: '8px 20px',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
  body: {
    maxWidth: '760px',
    margin: '0 auto',
    padding: '60px 24px 80px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  welcomeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '28px 32px',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: '#c6f135',
    color: '#0a0a0a',
    fontSize: '20px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    letterSpacing: '0.04em',
  },
  welcome: {
    margin: 0,
    fontSize: '26px',
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.45)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '20px 22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  cardLabel: {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
  },
  cardValue: {
    fontSize: '15px',
    fontWeight: 600,
  },
  section: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '0.04em',
  },
  sectionText: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: '1.6',
  },
  actionBtn: {
    display: 'inline-block',
    marginTop: '4px',
    padding: '11px 24px',
    background: '#c6f135',
    color: '#0a0a0a',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    width: 'fit-content',
  },
  sessionBox: {
    padding: '18px 22px',
    background: 'rgba(198,241,53,0.06)',
    border: '1px solid rgba(198,241,53,0.15)',
    borderRadius: '12px',
  },
  sessionNote: {
    margin: 0,
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: '1.6',
  },
}
